import express from 'express';
import controllers from '../controllers/_index.js';
const ProcessRoutes = express.Router();

ProcessRoutes.get('/', controllers.processController.index);
ProcessRoutes.get("/idFlow/:idFlow", controllers.processController.getProcessByIdFlow);
ProcessRoutes.get("/record/:record", controllers.processController.getProcessByRecord);
ProcessRoutes.get("/keys/:idFlow/:record", controllers.processController.getProcessByUniqueKeys);
ProcessRoutes.put("/updateProcess/:record", controllers.processController.updateProcess);
ProcessRoutes.put("/updateStage", controllers.processController.updateProcessStage);
ProcessRoutes.post("/newProcess", controllers.processController.store);
ProcessRoutes.delete("/deleteProcess/:record", controllers.processController.deleteProcess);
ProcessRoutes.get("/priorities", controllers.processController.getPriorityProcess);

export default ProcessRoutes;
