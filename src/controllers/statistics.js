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
        const key = item?.idStage;

        if (!stages[key ?? 'nao_iniciado'])
          stages[key ?? 'nao_iniciado'] = { name: '', process: [] };

        stages[key ?? 'nao_iniciado'] = {
          name: stage?.name ?? 'nao iniciado',
          idStage: key ?? null,
          countProcess: stages[key ?? 'nao_iniciado'].process.length,
          process: stages[key ?? 'nao_iniciado'].process,
        };

        stages[key ?? 'nao_iniciado'].process.push(item);
        stages[key ?? 'nao_iniciado'].countProcess =
          stages[key ?? 'nao_iniciado'].process.length;
      }

      return res.status(200).json({ stages });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}
