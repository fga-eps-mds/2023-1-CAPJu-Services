import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from '../../middleware/authMiddleware.js';
const ProcessesFileRoutes = express.Router();
const controller = controllers.processesFileController;

ProcessesFileRoutes.get('/findAllPaged', authenticate, controller.findAllPaged);
ProcessesFileRoutes.get('/findAllItemsPaged', authenticate, controller.findAllItemsPaged);
ProcessesFileRoutes.post('/newFile', authenticate, controller.create);
ProcessesFileRoutes.delete('/deleteFile/:idProcessesFile', authenticate, controller.deleteById);
ProcessesFileRoutes.get('/findFileById/:idProcessesFile/:dataFlag', authenticate, controller.findFileById);
ProcessesFileRoutes.put('/updateFile/:idProcessesFile', authenticate, () => {});
ProcessesFileRoutes.put('/updateFileItem/:idProcessesFileItem', authenticate, controller.updateFileItem);

export default ProcessesFileRoutes;