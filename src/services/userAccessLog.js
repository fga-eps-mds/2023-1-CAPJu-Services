import models from '../models/_index.js';
import jwt from 'jsonwebtoken';

class UserAccessLogService {
  constructor() {
    this.repository = models.UserAccessLog;
  }

  async hasActiveSessionRelatedToJWT(jwtToken) {
    const { sessionId } = jwt.decode(jwtToken).id;

    const session = await this.repository.findOne({
      where: {
        sessionId,
        logoutTimestamp: null,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
      raw: true,
      logging: false,
    });

    return !!session;
  }
}

export default UserAccessLogService;
