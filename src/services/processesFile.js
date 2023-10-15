import pino from 'pino';
import xlsx from 'node-xlsx';
import models from '../models/_index.js';
import ProcessService from './process.js';
import FlowService from './flow.js';
import PriorityService from './priority.js';
import {Op} from "sequelize";


const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            levelFirst: true,
            translateTime: false,
            ignore: 'pid,hostname,time',
            messageFormat: '{msg}',
        }
    },
});

const validProcessesHeader = ['Número processo', 'Número do Processo', 'Processos'];
const validNicknamesHeader = ['Apelido', 'Apelidos'];
const validFlowsHeader = ['Fluxo', 'Fluxos'];
const validPrioritiesHeaders = ['Prioridade', 'Prioridades', 'prioridades'];

export class ProcessesFileService {

    constructor(ProcessesFileModel) {
        this.processesFileRepository = ProcessesFileModel;
        this.processService= new ProcessService(models.Process);
        this.flowService = new FlowService(models.Flow);
        this.priorityService = new PriorityService(models.Priority);
        this.processesFileItemRepository = models.ProcessesFileItem;
    }

    findAllPaged = async (req) => {

        const { offset = 0, limit = 10 } = req.query;

        const where = await this.extractFiltersFromReq(req);

        let include;

        if(req.query.nameOrRecord) {
            include =  [
                {
                    model: models.ProcessesFileItem,
                    as: 'fileItems',
                    attributes: [],
                    where: {
                        record: { [Op.like]: `%${req.query.nameOrRecord}%` }
                    },
                    required: false,
                    duplicating: false
                }
            ]
        }

        console.log(req.nameOrRecord)
        const data = await this.processesFileRepository.findAll({
            where,
            offset,
            limit,
            order: [['idProcessesFile', 'DESC']],
            include,
            attributes: ['idProcessesFile', 'name', 'fileName', 'status', 'message', 'createdAt'],
        });

        const totalCount = await this.processesFileRepository.count({ where, include });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        return {
            data,
            pagination: {
                totalRecords: totalCount,
                totalPages: totalPages,
                currentPage: currentPage,
                perPage: limit,
            }
        };

    }

    findById = async (idProcessesFile) => {
        return await this.processesFileRepository.findOne({
            where: {
                idProcessesFile
            },
            attributes: ['idProcessesFile', 'status', 'createdAt'],
            raw: true,
        })
    }

    findAllItemsPaged = async (req) => {

        const { offset = 0, limit = 10, idProcessesFile } = req.query;

        const where = { idProcessesFile }

        const data = await this.processesFileItemRepository.findAll({
            where,
            offset,
            limit,
            order: [['status', 'ASC']],
            include: [
                {
                    model: models.Process,
                    as: 'generatedProcessInfo',
                    attributes: ['idFlow'],
                    required: false,
                },
            ],
            raw: true,
        });

        const totalCount = await this.processesFileItemRepository.count({ where });

        console.log(totalCount)
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        return {
            data,
            pagination: {
                totalRecords: totalCount,
                totalPages: totalPages,
                currentPage: currentPage,
                perPage: limit,
            }
        };

    }

    createFile = async (data) => {

        data.fileName = this.getFormattedFileName(data.fileName);

        return (({idProcessesFile, status}) => ({
            idProcessesFile,
            status
        }))(await this.processesFileRepository.create(data));

    }

    findFileById = async (idProcessesFile, dataFlag) => {
        return await this.processesFileRepository.findOne({
            where: { idProcessesFile },
            attributes: ['idProcessesFile', dataFlag === 'original' ? 'dataOriginalFile' : 'dataResultingFile', 'fileName'],
            raw: true,
        })
    }

    deleteFileById = async (idProcessesFile) => {
        console.log(idProcessesFile)
        await this.processesFileItemRepository.destroy({ where: { idProcessesFile } });
        return await this.processesFileRepository.destroy({ where: { idProcessesFile } });
    }

    executeJob = async () => {

        logger.info('Iniciando rotina de importação de processos interna');

        // logic based on the assumption that the files will be small.
        const files = await this.processesFileRepository.findAll({
            where: { status: 'waiting'},
            raw: true,
            order: [['idProcessesFile', 'ASC']],
            attributes: ['idProcessesFile', 'fileName', 'dataOriginalFile', 'importedBy'],
            limit: 10,
        });

        if(!files?.length) return;

        const idProcessesFile = files.map(f => f.idProcessesFile);

        await this.processesFileRepository.update({ status : 'inProgress' }, { where: { idProcessesFile } });

        for (const file of files) {

            try {

                logger.info(`Iniciando processamento arquivo [${file.idProcessesFile}-${file.fileName}]`);

                logger.info(`Iniciando parser arquivo [${file.idProcessesFile}-${file.fileName}]`);

                const workbook = xlsx.parse(file.dataOriginalFile);

                logger.info(`Parser arquivo [${file.idProcessesFile}-${file.fileName}] concluído`);

                const headerIndex = workbook[0].data.findIndex(row => row.length);

                logger.info(`Index cabeçalho ${headerIndex}`);

                if(headerIndex === -1) {
                    throw new Error('Cabeçalho não encontrado');
                }

                const header = workbook[0].data[headerIndex];

                let headerErrorMessages = '';
                const validationsMandatoyHeaders = [
                    { headers: validProcessesHeader, errorMessage: 'Coluna processos não encontrada', key: 'processHeaderIndex' },
                    { headers: validNicknamesHeader, errorMessage: 'Coluna apelidos não encontrada', key: 'nicknamesHeaderIndex' },
                    { headers: validFlowsHeader, errorMessage: 'Coluna fluxos não encontrada', key: 'flowsHeaderIndex' },
                ];

                const headerIndexes = {};
                validationsMandatoyHeaders.forEach(validation => {
                    const index = header.findIndex(h => validation.headers.includes(h));
                    if (index === -1) {
                        headerErrorMessages = headerErrorMessages.concat(validation.errorMessage, '\n');
                    } else {
                        headerIndexes[validation.key] = index;
                    }
                });

                if(headerErrorMessages) {
                    throw new Error(headerErrorMessages);
                }

                const prioritesIndex = header.findIndex(h => validPrioritiesHeaders.includes(h));
                if(prioritesIndex !== -1) {
                    headerIndexes.prioritiesHeaderIndex = prioritesIndex;
                }

                const resultingSheetWorkbooks = [];

                for (const worksheet of workbook) {

                    const sheetDataArray = worksheet.data.slice(headerIndex+1);
                    const sheetDataMap = new Map();
                    Object.keys(headerIndexes).forEach(indexName => {
                        const headerPosition = headerIndexes[indexName];
                        sheetDataMap.set(headerPosition, sheetDataArray.map(a => a[headerPosition]));
                    });

                    const numberOfRows = sheetDataMap.get(headerIndexes.processHeaderIndex).length
                    let processesFileItems = [];

                    let rowIndex = 0;

                    logger.info(`Populando mapa arquivo [${file.idProcessesFile}-${file.fileName}]`);

                    while (rowIndex<numberOfRows) {

                        const record = sheetDataMap.get(headerIndexes.processHeaderIndex)[rowIndex];
                        const nickname = sheetDataMap.get(headerIndexes.nicknamesHeaderIndex)[rowIndex];
                        const flow = sheetDataMap.get(headerIndexes.flowsHeaderIndex)[rowIndex];
                        const priority = sheetDataMap.get(headerIndexes.prioritiesHeaderIndex)?.at(rowIndex);

                        const fileItem = {
                            record,
                            flow,
                            nickname,
                            priority,
                            idProcessesFile: file.idProcessesFile,
                            rowIndex,
                        };

                        processesFileItems.push(fileItem);

                        rowIndex++;
                    }

                    logger.info(`Mapa populado [${file.idProcessesFile}-${file.fileName}]`);

                    const processes = [];

                    const flows = await this.flowService.findAllRawWithAttributes({ name : sheetDataMap.get(headerIndexes.flowsHeaderIndex) }, ['idFlow', 'idUnit', 'name']);

                    for (let j = 0; j < processesFileItems.length; j++) {

                        const fileItem = processesFileItems[j];

                        if(Object.values(fileItem).every(value => value === undefined))
                            continue;

                        let message = '';
                        let status = 'imported';

                        const process = {};

                        const mandatoryNonEmptyFields = [{ name: 'Número processo', key: 'record' },
                                                         { name: 'Fluxo', key: 'flow' },
                                                         { name: 'Apelido', key: 'nickname' }].filter(field => !fileItem[field.key])

                        if(mandatoryNonEmptyFields.length) {
                            mandatoryNonEmptyFields.forEach(emptyField => message = message.concat(`${emptyField.name} vazio `));
                            status = 'error';
                        }

                        if(fileItem.flow) {

                            const flow = flows.find(f => f.name === fileItem.flow);

                            if(!flow) {
                                message = message.concat(`Fluxo ${fileItem.flow} inválido `);
                                status = 'error';
                            } else {
                                Object.assign(process, { idFlow: flow.idFlow, idUnit: flow.idUnit });
                            }

                        }

                        if(fileItem.record) {

                            const { filteredRecord: record, valid } = this.validateRecord(fileItem.record);

                            if(!valid) {
                                message = message.concat(`Número de processo ${fileItem.record} fora do padrão CNJ `);
                                status = 'error';
                            } else {
                                Object.assign(process, { record });
                            }

                        }

                        const idPriority = this.getPriorityIdByDescriptionOrAbbreviation(fileItem.priority);
                        if(idPriority === null) {
                            message = message.concat(`Prioridade ${fileItem.priority} não encontrada `);
                        } else {
                            Object.assign(process, { idPriority });
                        }

                        if(status !== 'error') {
                            Object.assign(process, { nickname: fileItem.nickname, finalised: false } );
                            fileItem.process = process;
                            processes.push(process);
                        } else {
                            Object.assign(fileItem, { message } );
                        }

                        Object.assign(fileItem, { status } );

                    }

                    const resultingSheetData = [ [...worksheet.data[headerIndex], 'Resultado', 'Mensagens'], ...worksheet.data.slice(headerIndex+1)]
                    resultingSheetWorkbooks.push({ name: worksheet.name, data: resultingSheetData  })
                    const initialIndex = headerIndex + 1;
                    processesFileItems.forEach((processesFileItem,i) => {
                        const currentRow = resultingSheetData[initialIndex+i];
                        let aux = 0;
                        while (aux < worksheet.data[headerIndex].length) {
                            if(!currentRow[aux])
                                currentRow.splice(aux, 1, undefined);
                            aux++;
                        }
                        currentRow.splice(worksheet.data[headerIndex].length,0, processesFileItem.status === 'imported' ? 'IMPORTADO' : 'ERRO');
                        currentRow.splice(worksheet.data[headerIndex].length+1,0,processesFileItem.message || '-');
                    });

                    const processesAuds = [];

                    const processesResponse = await models.Process.bulkCreate(processes,  { returning: true });

                    processesResponse.forEach((process, i) => {
                        process = process.toJSON();
                        processes[i].idProcess = process.idProcess;
                        processesAuds.push({
                            processRecord: process.record,
                            idProcess: process.idProcess,
                            operation: 'INSERT',
                            changedBy: file.importedBy,
                            newValues: JSON.stringify(process),
                            changedAt: new Date(),
                            remarks: null,
                            oldValues: null,
                        });
                    });

                    processesFileItems = processesFileItems.map(fI => ({ ...fI, idProcess: fI.process?.idProcess }));

                    await models.ProcessAud.bulkCreate(processesAuds);
                    await this.processesFileItemRepository.bulkCreate(processesFileItems);
                    await this.processesFileRepository.update({ status : 'imported', message: null, importedAt: new Date() }, { where: { idProcessesFile: file.idProcessesFile } });

                }

                const resultingSheet = xlsx.build(resultingSheetWorkbooks).buffer;

                await this.processesFileRepository.update({ dataResultingFile: Buffer.from(resultingSheet) }, { where: { idProcessesFile: file.idProcessesFile } });

            } catch (error) {
                logger.error(`Erro ao processar planilha: ${error}`);
                await this.processesFileRepository.update({ status : 'error', message: error, importedAt: null, dataResultingFile: null }, { where: { idProcessesFile: file.idProcessesFile } });
            }

        }
    }

    getFormattedFileName = (fileName) => {
        let formattedName = fileName.replace(/ /g, "_");
        formattedName = formattedName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
        return formattedName;
    }

    getPriorityIdByDescriptionOrAbbreviation = (str) => {

        const patternsAndIds = [
            { key: ['Sem prioridade', '', undefined], value: 0 },
            { key: ['Idoso', 'Idosa(a) maior de 80 anos'], value: 4 },
            { key: ['Art. 1048, II', 'ECA'], value: 1 },
            { key: ['Art. 1048, IV', 'Licitação'], value: 2 },
            { key: ['Art. 7 - 12.016/2009'], value: 3 },
            { key: ['Doença grave', 'Portador(a) de doença grave'], value: 7 },
            { key: ['Deficiente', 'Pessoa com deficiencia'], value: 5 },
            { key: ['Situação rua', 'Pessoa em situação de rua'], value: 6 },
            { key: ['Réu Preso', 'Réu preso', 'preso'], value: 8 },
        ];

        for (const pattern of patternsAndIds) {
            if (pattern.key.some(substring => str === substring)) {
                return pattern.value;
            }
        }

        return null;
    };

    validateRecord = (record) => {
        if(typeof record === 'number')
            record = record.toString();
        const filteredRecord = record.replace(/[^\d]/g, "");
        const regexFilter = /^\d{20}$/;
        const isRecordValid = regexFilter.test(filteredRecord);

        return {
            filteredRecord,
            valid: isRecordValid,
        };
    };

    async extractFiltersFromReq(req) {
        const filter = {};
        const { nameOrRecord } = req.query;
        if (nameOrRecord) {
            const filterValue = `%${nameOrRecord}%`;
            filter[Op.or] = [
                { name: { [Op.like]: filterValue } },
                { fileName: { [Op.like]: filterValue } },
                { '$fileItems.record$': { [Op.like]: filterValue } }
            ];
        }
        return filter;
    }

}