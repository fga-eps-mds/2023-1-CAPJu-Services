import services from '../services/_index.js';

export class UserAccessLogController {
  constructor() {
    this.service = services.userAccessLogService;
  }

  findAllPaged = async (req, res) => {
    try {
      const data = await this.service.findAllPaged(req, res);
      return res.status(200).json(data);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `${error}`, message: `Erro ao buscar arquivos` });
    }
  };
}
