import { QueryTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import 'dotenv/config';

class FlowService {
  constructor(FlowModel) {
    this.flow = FlowModel;
  }

  async findAll({ where, attributes, offset, limit }) {
    const options = {
      where: where,
      offset: offset || 0,
      attributes,
    };

    if (limit !== Infinity) {
      options.limit = limit;
    }

    return this.flow.findAll(options);
  }

  async findAllRawWithAttributes(where, attributes) {
    const options = {
      where,
      attributes,
      raw: true,
    };

    return this.flow.findAll(options);
  }

  async countRows({ where }) {
    return this.flow.count({ where });
  }

  async findOneByFlowId(idFlow, attributes) {
    const query = {
      where: { idFlow },
    };

    if (attributes && attributes.length) {
      query.attributes = attributes;
    }

    return this.flow.findOne(query);
  }

  async createFlow(params) {
    return this.flow.create(params);
  }

  async updateFlow(name, idFlow) {
    const [updatedRows] = await this.flow.update(
      { name },
      { where: { idFlow } },
    );
    if (updatedRows) {
      const updatedFlow = await this.findOneByFlowId(idFlow);
      return updatedFlow;
    } else {
      return false;
    }
  }

  async deleteFlowById(idFlow) {
    return await this.flow.destroy({ where: { idFlow } });
  }

  async getHistoricByFlowId(idFlow) {
    const query_results = await sequelizeConfig.query(
      `SELECT 
        P."idFlow", A."idProcess", A."processRecord", A."operation", A."changedAt", A."newValues" 
        FROM "processAud" A 
        INNER JOIN process P on P."idProcess"=A."idProcess" 
        WHERE P."idFlow" = ? AND A."operation" = 'UPDATE';`,
      {
        replacements: [idFlow],
        type: QueryTypes.SELECT,
      },
    );

    return query_results;
  }

  async stagesSequencesFromFlowStages(flowStages) {
    let sequences = [];
    let stages = [];
    if (flowStages.length > 0) {
      for (const { idStageA: from, commentary, idStageB: to } of flowStages) {
        sequences.push({ from, commentary, to });
        if (!stages.includes(from)) {
          stages.push(from);
        }
        if (!stages.includes(to)) {
          stages.push(to);
        }
      }
    }
    return { stages, sequences };
  }
}

export default FlowService;
