import services from '../services/_index.js';

export class ProcessAudController {
  constructor() {
    this.processAudService = services.processAudService;
  }

  findAllPaged = async (req, res) => {
    try {
      const processEvents = await this.processAudService.findAllPaged(req, res);
      return res.status(200).json(processEvents);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `${error}`, message: `Erro ao buscar histórico` });
    }
  };

  findAll = async (req, res) => {
    try {
      const processEvents = await this.processAudService.findAll(req);
      return res.status(200).json(processEvents);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `${error}`, message: `Erro ao buscar histórico` });
    }
  };

  generateXlsx = async (req, res) => {
    try {
      const resultingXlsxBuffer = await this.processAudService.generateXlsx(
        req,
      );
      return res.status(200).json(resultingXlsxBuffer);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `${error}`, message: `Erro ao gerar excel` });
    }
  };
}
