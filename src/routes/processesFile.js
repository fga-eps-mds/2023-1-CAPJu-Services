import express from 'express';
import controllers from '../controllers/_index.js';
const ProcessesFileRoutes = express.Router();
const controller = controllers.processesFileController;

ProcessesFileRoutes.get('/findAllPaged', controller.findAllPaged);

ProcessesFileRoutes.get('/findAllItemsPaged', controller.findAllItemsPaged);
ProcessesFileRoutes.post('/newFile', controller.create);
ProcessesFileRoutes.delete(
  '/deleteFile/:idProcessesFile',
  controller.deleteById,
);
ProcessesFileRoutes.get(
  '/findFileById/:idProcessesFile',
  controller.findFileById,
);
ProcessesFileRoutes.put('/updateFile/:idProcessesFile', () => {});
ProcessesFileRoutes.put(
  '/updateFileItem/:idProcessesFileItem',
  controller.updateFileItem,
);

export default ProcessesFileRoutes;
