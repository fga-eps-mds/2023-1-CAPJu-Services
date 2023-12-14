import { QueryTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import 'dotenv/config';

class StatisticsService {
  constructor() {}

  async SearchDueDate(minDate, maxDate, offSet, limit) {
    const query_results = await sequelizeConfig.query(
      `SELECT 
        p."record" as record,
        p."nickname" as nickname,
        p."status" as "status",
        p."idFlow" as "idFlow",
        p."idPriority" as "idPriority",
        p."idStage" as "idStage",
        p."idUnit" as "idUnit",
        p."effectiveDate" as "effectiveDate",
        s."name" as "nameStage",
        f."name" as "nameFlow",
        p."effectiveDate" + (s."duration" * interval '1 day') as "dueDate"
        FROM process p
        JOIN stage s ON p."idStage" = s."idStage"
        JOIN flow f ON p."idFlow" = f."idFlow"
        WHERE p."effectiveDate" + (s.duration * interval '1 day') >=  :minDate
          AND p."effectiveDate" + (s.duration * interval '1 day') <= :maxDate
          AND "status" = 'inProgress'
          ORDER BY "idFlow", "dueDate"
        OFFSET :offSet
        LIMIT :limit;`,
      {
        replacements: {
          minDate: new Date(minDate),
          maxDate: new Date(maxDate),
          offSet: offSet, // Corrigido para offSet
          limit: limit, // Corrigido para limit
        },
        type: QueryTypes.SELECT,
      },
    );

    return query_results;
  }

  async countRowsDueDate(minDate, maxDate) {
    const query_results = await sequelizeConfig.query(
      `SELECT 
        p."record" as record,
        p."status" as "status",
        p."effectiveDate" + (s."duration" * interval '1 day') as dueDate
        FROM process p
        JOIN stage s ON p."idStage" = s."idStage"
        JOIN flow f ON p."idFlow" = f."idFlow"
        WHERE p."effectiveDate" + (s.duration * interval '1 day') >=  :minDate
          AND p."effectiveDate" + (s.duration * interval '1 day') <= :maxDate
          AND "status" = 'inProgress';`,
      {
        replacements: {
          minDate: new Date(minDate),
          maxDate: new Date(maxDate),
        },
        type: QueryTypes.SELECT,
      },
    );

    const countRows = query_results.length;

    return countRows;
  }
}

export default StatisticsService;
