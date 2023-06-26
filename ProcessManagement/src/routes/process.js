import express from 'express';
import controllers from '../controllers/_index.js';
const ProcessRoutes = express.Router();

ProcessRoutes.get('/', controllers.processController.index);
ProcessRoutes.get("/:idFlow", controllers.processController.getProcessByIdFlow);
ProcessRoutes.get("/:record", controllers.processController.getProcessByRecord);
ProcessRoutes.get("/:idFlow/:record", controllers.processController.getProcessByUniqueKeys);
ProcessRoutes.post("/newProcess", controllers.processController.store);
ProcessRoutes.post("/updateProcess", controllers.processController.updateProcess);
ProcessRoutes.post("/updateStage", controllers.processController.updateProcessStage);
ProcessRoutes.post("/deleteProcess/:record", controllers.processController.deleteProcess);
ProcessRoutes.get("/priorities", controllers.processController.getPriorityProcess);

export default ProcessRoutes;
