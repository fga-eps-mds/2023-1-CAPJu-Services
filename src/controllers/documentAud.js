import models from '../models/_index.js';
import { userFromReq } from '../../middleware/authMiddleware.js';

export class DocumentAudController {
  constructor() {
    this.documentAudRepository = models.DocumentAud;
  }

  registerEvent = async (req, res) => {
    try {
      const documentAud = (({ emitedAt, emitedBy, uuid, type }) => ({
        emitedAt,
        emitedBy,
        uuid,
        type,
      }))(req.body);
      if (documentAud.emitedBy !== (await userFromReq(req)).cpf)
        return res.status(500).json({
          error: 'Erro ao registrar evento',
          message: `Usuário da requisição diverge do usuário do evento`,
        });
      await this.documentAudRepository.create(documentAud, {
        returning: false,
      });
      return res.status(200).json({});
    } catch (error) {
      return res
        .status(500)
        .json({ error: `${error}`, message: `Erro ao registrar evento` });
    }
  };
}
