import 'dotenv/config';
import services from '../services/_index.js';

export class PriorityController {
  constructor() {
    this.priorityService = services.priorityService;
  }

  getAllPriorities = async (req, res) => {
    try {
      const priorities = await this.priorityService.getAllPriorities();
      if (!priorities) {
        return res
          .status(401)
          .json({ message: 'Não existem prioridades cadatradas' });
      } else {
        return res.status(200).json(priorities);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar prioridades' });
    }
  };
}
