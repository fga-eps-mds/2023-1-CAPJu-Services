import services from '../services/_index.js';
import 'dotenv/config';

export class StatisticsController {
    constructor(){
        this.statisticsService = services.statisticsService;
    }

    getProcessByDueDateInFlow = async (req, res) => {

        try {

            // Pega Data Inicial e Final
            const { minDate, maxDate } = req.params;

            if (!minDate || !maxDate)
                return res.status(412).json({ error: "É necessário indicar o período de vencimento!" })

            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 10;

            const processInDue = await this.statisticsService.SearchDueDate(minDate, maxDate, offset, limit);


            const totalCount = await this.statisticsService.countRowsDueDate(minDate, maxDate);
            const totalPages = Math.ceil(totalCount / limit) || 0;

            return res.status(200).json({processInDue, totalPages});
            // return res.status(200).json(result);

        } catch (error) {
            
            return res.status(500).json({ message: error });
        }

    }

}