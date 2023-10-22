import services from '../services/_index.js';
import 'dotenv/config';

export class StatisticsController {
    constructor(){
        this.processService = services.processService;
        this.stageService = services.stageService;
        this.flowStageService = services.flowStageService;
        this.statisticsService = services.statisticsService;
    }

    getProcessByDueDateInFlow = async (req, res) => {

        try {

            // Pega Data Inicial e Final
            const { minDate, maxDate } = req.params;

            if (!minDate || !maxDate)
                return res.status(412).json({ error: "É necessário indicar o período de vencimento!" })

            console.log(minDate, maxDate);

            const processInDue = await this.statisticsService.SearchDueDate(minDate, maxDate);

            return res.status(200).json({processInDue});
            // return res.status(200).json(result);

        } catch (error) {
            
            return res.status(500).json({ message: error });
        }

    }

}