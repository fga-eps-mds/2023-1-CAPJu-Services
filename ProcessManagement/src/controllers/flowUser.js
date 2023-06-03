import 'dotenv/config';
import services from '../services/_index.js';

export class FlowUserController {
  constructor() {
    this.flowUserService = services.flowUserService;
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
