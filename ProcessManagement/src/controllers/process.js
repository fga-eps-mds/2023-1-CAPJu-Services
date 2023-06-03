import 'dotenv/config';
import services from '../services/_index.js';

export class ProcessController {
  constructor() {
    this.processService = services.processService;
  }

  getAllProcess = async (req, res) => {
    try {
      const process = await this.processService.getAllProcess();
      if (!process) {
        return res
          .status(401)
          .json({ message: 'Não Existem processos cadatrados' });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar processos' });
    }
  };
}
