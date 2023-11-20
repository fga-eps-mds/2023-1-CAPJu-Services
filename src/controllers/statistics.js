import services from '../services/_index.js';
import 'dotenv/config';

export class StatisticsController {
  constructor() {
    this.processService = services.processService;
    this.stageService = services.stageService;
    this.flowStageService = services.flowStageService;
    this.statisticsService = services.statisticsService;
  }

  getProcessByStepInFlow = async (req, res) => {
    try {
      const { idFlow, idStage } = req.params;
      const { offset = 0, limit = 5 } = req.query;

      if (!idFlow)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de um fluxo' });

      if (!idStage)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de uma etapa' });

      const { count, rows } = await this.processService.getAndCountAllProcess({
        where: {
          idFlow,
          idStage,
        },
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit) || 0;

      return res.status(200).json({ process: rows, totalPages });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getProcessCountByStepInFlow = async (req, res) => {
    try {
      const { idFlow } = req.params;

      if (!idFlow)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de um fluxo' });

      const stages = {};

      const processesbyIdFlow = await this.processService.getProcessByIdFlow(
        idFlow,
      );

      for (const item of processesbyIdFlow) {
        const stage = await this.stageService.findOneByStageId(item.idStage);
        const key = item?.idStage ?? 'nao_iniciado';

        if (!stages[key])
          stages[key] = { name: '', process: [], countProcess: 0 };

        stages[key] = {
          name: stage?.name ?? 'nao iniciado',
          idStage: key ?? null,
          countProcess: ++stages[key].countProcess,
        };
      }

      return res.status(200).json({ stages });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllProcessByStepInStage = async (req, res) => {
    try {
      const { idFlow, idStage } = req.params;

      if (!idFlow)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de um fluxo' });

      if (!idStage)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de uma etapa' });

      const process = await this.processService.getAllProcess({
        where: {
          idFlow,
          idStage,
        },
      });

      return res.status(200).json({ process });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getProcessByDueDateInFlow = async (req, res) => {
    try {
      // Pega Data Inicial e Final
      const { minDate, maxDate } = req.params;

      if (!minDate || !maxDate)
        return res
          .status(412)
          .json({ error: 'É necessário indicar o período de vencimento!' });

      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const processInDue = await this.statisticsService.SearchDueDate(
        minDate,
        maxDate,
        offset,
        limit,
      );

      const formattedProcessInDue = processInDue.map(process => ({
        ...process,
        // Adapte o formato da data conforme necessário
        dueDate: new Date(process.dueDate).toLocaleDateString('pt-BR'),
      }));

      const totalCount = await this.statisticsService.countRowsDueDate(
        minDate,
        maxDate,
      );
      const totalPages = Math.ceil(totalCount / limit) || 0;

      return res
        .status(200)
        .json({ processInDue: formattedProcessInDue, totalPages });
      // return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
