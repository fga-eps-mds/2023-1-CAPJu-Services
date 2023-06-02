import 'dotenv/config';
import models from '../models/_index.js';
import FlowService from '../services/flow.js';

export class FlowController {
    constructor() {
        this.flowService = new FlowService(models.Flow);
    }

    getAllFlows = async (req, res) => {
        try {
            const priorities = await this.flowService.getAllFlows();
            if (!priorities) {
                return res
                    .status(401)
                    .json({ message: 'Não existem fluxos cadatradas' });
            } else {
                return res.status(200).json(priorities);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar fluxo' });
        }
    };
}
