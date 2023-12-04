import { Op } from 'sequelize';
import models from '../models/_index.js';
import jwt from 'jsonwebtoken';

class UserAccessLogService {

    constructor(UserAccessLogModel) {
        this.repository = UserAccessLogModel;
    }

    async hasSessionActiveOnAnotherStation(userCPF, reqIp) {
        return await this.repository.findOne({
            where: {
                userCPF: userCPF,
                logoutTimestamp: null,
                stationIp: {
                    [Op.ne]: reqIp
                }
            },
            attributes: ['id'],
            order: [['id', 'DESC']],
            raw: true,
        });
    }

    async createAndFillExpired({ loginTimestamp, stationIp, jwtToken, userCPF, sessionId }) {
        await this.repository.update(
            {
                logoutTimestamp: new Date(),
                logoutInitiator: 'sessionRenewalOnSameStation'
            },
            {
                where: {
                    userCPF: userCPF,
                    logoutTimestamp: null
                }
            }
        );
        return await this.repository.create({
            loginTimestamp: loginTimestamp || new Date(),
            sessionId,
            stationIp,
            jwtToken,
            userCPF,
        });
    }

    async update(values, options) {
        await this.repository.update(values, options);
    }

    async findAllPaged(req) {

        const { offset = 0, limit = 10 } = req.query;

        const where = this.extractFiltersFromReq(req);

        const include = [
            {
                model: models.User,
                as: 'userInfo',
                attributes: ['fullName'],
                required: true,
                duplicating: false,
                include: [
                    {
                        model: models.Unit,
                        as: 'unit',
                        attributes: ['name'],
                        required: false
                    }
                ]
            },
        ];

        const data = await this.repository.findAll({
            where,
            offset,
            limit,
            order: [['id', 'DESC']],
            include,
            attributes: [
                'loginTimestamp',
                'stationIp',
                'sessionId',
            ],
            logging: false,
        });

        const totalCount = await this.repository.count({
            where,
            include,
        });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        return {
            data,
            pagination: {
                totalRecords: totalCount,
                totalPages: totalPages,
                currentPage: currentPage,
                perPage: limit,
            },
        };
    }

    async isSessionIdPresent(sessionId) {

        const session = await this.repository.findOne({
            where: { sessionId },
            attributes: ['id'],
            raw: true,
        });

        return !!session;

    }

    async isSessionActive(sessionId) {
        const session = await this.repository.findOne({
            where: { sessionId },
            attributes: ['logoutTimestamp', 'logoutInitiator'],
            raw: true,
            logging: false,
        });
        return {
            active: !session.logoutTimestamp,
            message: this.getMessageFromLogoutInitiator(session.logoutInitiator)
        }
    }

    async hasActiveSessionRelatedToJWT(jwtToken) {

        const { sessionId } = jwt.decode(jwtToken).id

        const session = await this.repository.findOne({
            where: {
                sessionId,
                logoutTimestamp: null,
            },
            attributes: ['id'],
            order: [['id', 'DESC']],
            raw: true,
            logging: false,
        });

        return !!session;
    }

    extractFiltersFromReq(req) {
        const filter = {};
        const { nameOrEmailOrCpf, active = false } = req.query;

        if (nameOrEmailOrCpf) {
            const filterValue = `%${nameOrEmailOrCpf}%`;
            filter[Op.or] = [
                { '$userInfo.email$': { [Op.like]: filterValue } },
                { '$userInfo.fullName$': { [Op.like]: filterValue } },
                { '$userInfo.cpf$': { [Op.like]: filterValue } },
            ];
        }

        if (active === 'true') {
            filter.logoutTimestamp = { [Op.is]: null };
        }

        return filter;
    }

    getMessageFromLogoutInitiator(logoutInitiator) {
        return {
            adminInitiated: 'Sessão encerrada pelo administrador',
            sessionRenewalOnSameStation: 'Uma nova sessão foi iniciada nesta estação.',
        }[logoutInitiator];
    }

}

export default UserAccessLogService;