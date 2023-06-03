import 'dotenv/config';
import models from '../models/_index.js';
import FlowUserService from '../services/flowUser.js';

export class FlowUserController {
  constructor() {
    this.flowUserService = new FlowUserService(models.FlowUser);
  }

  getAllFlowsUsers = async (req, res) => {
    try {
      console.log('FlowUserController => getAllFlowsUsers => ');
      const flowsUsers = await this.flowUserService.getAllFlowsUsers();
      if (!flowsUsers) {
        return res
          .status(401)
          .json({ message: 'Não existem fluxos de usuários cadatradas' });
      } else {
        return res.status(200).json(flowsUsers);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao buscar fluxos de usuários' });
    }
  };
}
