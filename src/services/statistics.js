import { QueryTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import 'dotenv/config';

class StatisticsService {

  constructor() {}

  async SearchDueDate(minDate, maxDate) {
    const query_results = await sequelizeConfig.query(
      `SELECT 
        p."record" as record,
        p."nickname" as nickname,
        p."idFlow" as idFlow,
        p."idPriority" as idPriority,
        p."idStage" as idStage,
        p."idUnit" as idUnit,
        p."effectiveDate" as effectiveDate,
        p."status" as status,
        s."name" as nameStage,
        f."name" as nameFlow,
        p."effectiveDate" + (s."duration" * interval '1 day') as dueDate
        FROM process p
        JOIN stage s ON p."idStage" = s."idStage"
        JOIN flow f ON p."idFlow" = f."idFlow"
        WHERE p."effectiveDate" + (s.duration * interval '1 day') >=  :minDate
          AND p."effectiveDate" + (s.duration * interval '1 day') <= :maxDate;`,
      {
        replacements: {
          minDate: new Date(minDate),
          maxDate: new Date(maxDate)
        },
        type: QueryTypes.SELECT,
      },
    );
      
    return query_results;
  }

}

export default StatisticsService;