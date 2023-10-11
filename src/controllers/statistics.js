import services from '../services/_index.js';

export class StatisticsController {
    constructor(){
        this.processService = services.processService;
    }

    getProcessByStepInFlow = async (req, res) => {
        //pegar Id do fluxo
        const { idFlow } = req.params;
        
        //Consultar os processos do fluxo

        const process = await this.processService.getProcessByIdFlow(idFlow); 
        console.log(process);

        //Agrupar estes processos por etapas
        
    }
}