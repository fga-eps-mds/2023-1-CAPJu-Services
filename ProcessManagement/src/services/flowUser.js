import { QueryTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import 'dotenv/config';

class FlowUserService {
  constructor(FlowUserModel) {
    this.flowUser = FlowUserModel;
  }
  async getAllFlowsUsers() {
    return this.flowUser.findAll();
  }

  async createFlowUser(cpf, idFlow) {
    return this.flowUser.create({ cpf, idFlow });
  }

  async deleteFlowUserById(idFlow) {
    return this.flowUser.destroy({ where: { idFlow } });
  }

  async getUsersToNotify(idFlow) {
    const query_results = await sequelizeConfig.query(
      'SELECT \
      "flowUser"."idFlow" AS "idFlow", "flowUser".cpf AS cpf, \
      users."fullName" AS "fullName", users.email AS email, \
      users."idUnit" AS "idUnit" \
      FROM "flowUser" \
      JOIN users ON "flowUser".cpf = users.cpf \
      WHERE "flowUser"."idFlow" = ?',
      {
        replacements: [idFlow],
        type: QueryTypes.SELECT,
      },
    );

    return query_results;
  }
}

export default FlowUserService;
