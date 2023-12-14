import express from 'express';
import controllers from '../controllers/_index.js';

const ProcessRoutes = express.Router();

// CRUD

ProcessRoutes.get('/', controllers.processController.index);
ProcessRoutes.get('/:idProcess', controllers.processController.getProcessById);
ProcessRoutes.post('/newProcess', controllers.processController.store);
ProcessRoutes.put(
  '/updateProcess/:idProcess',
  controllers.processController.updateProcess,
);
ProcessRoutes.delete(
  '/deleteProcess/:idProcess',
  controllers.processController.deleteProcess,
);

// BUSINESS

ProcessRoutes.put(
  '/finalizeProcess/:idProcess',
  controllers.processController.finalizeProcess,
);
ProcessRoutes.put(
  '/archiveProcess/:idProcess/:archiveFlag',
  controllers.processController.archiveProcess,
);
ProcessRoutes.put(
  '/updateStage',
  controllers.processController.updateProcessStage,
);

ProcessRoutes.get(
  '/idFlow/:idFlow',
  controllers.processController.getProcessesByIdFlow,
);
ProcessRoutes.get(
  '/keys/:idFlow/:record',
  controllers.processController.getProcessByUniqueKeys,
);
ProcessRoutes.get(
  '/priorities',
  controllers.processController.getPriorityProcess,
);

/**
 * @deprecated Use getProcessById instead
 */
ProcessRoutes.get(
  '/record/:record',
  controllers.processController.getProcessByRecord,
);

export default ProcessRoutes;
