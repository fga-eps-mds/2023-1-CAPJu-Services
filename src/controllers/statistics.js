import services from '../services/_index.js';

export class StatisticsController {
  constructor() {
    this.processService = services.processService;
    this.stageService = services.stageService;
    this.flowStageService = services.flowStageService;
  }

  getProcessByStepInFlow = async (req, res) => {
    try {
      // Pega id do fluxo
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

      const stages = {};

      // Pega os processos do fluxo
      const processesbyIdFlow = await this.processService.getAllProcess({
          where: {
            idFlow, 
            idStage,
          },
          limit,
          offset,
      });

      return res.status(200).json({ processesbyIdFlow });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getProcessCountByStepInFlow = async (req, res) => {
    try {
      // Pega id do fluxo
      const { idFlow } = req.params;

      if (!idFlow)
        return res
          .status(412)
          .json({ error: 'É necessário fornecer um id de um fluxo' });

      const stages = {};

      // Pega os processos do fluxo
      const processesbyIdFlow = await this.processService.getProcessByIdFlow(
        idFlow,
      );

      // Agrupa os processos por seu idStage e recupera informações da stage
      for (const item of processesbyIdFlow) {
        const stage = await this.stageService.findOneByStageId(item.idStage);
        const key = item?.idStage ?? 'nao_iniciado';

        if (!stages[key]) stages[key] = { name: '', process: [], countProcess: 0 };

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
}
