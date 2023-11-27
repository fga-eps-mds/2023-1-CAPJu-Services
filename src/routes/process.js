import express from 'express';
import controllers from '../controllers/_index.js';
import { authenticate, authorize } from '../../middleware/authMiddleware.js';

const ProcessRoutes = express.Router();

// CRUD

ProcessRoutes.get(
  '/',
  authenticate,
  authorize('see-process'),
  controllers.processController.index,
);
ProcessRoutes.get(
  '/:idProcess',
  authenticate,
  authorize('see-process'),
  controllers.processController.getProcessById,
);
ProcessRoutes.post(
  '/newProcess',
  authenticate,
  authorize('create-process'),
  controllers.processController.store,
);
ProcessRoutes.put(
  '/updateProcess/:idProcess',
  authenticate,
  authorize('edit-process'),
  controllers.processController.updateProcess,
);
ProcessRoutes.delete(
  '/deleteProcess/:idProcess',
  authenticate,
  authorize('delete-process'),
  controllers.processController.deleteProcess,
);

// BUSINESS

ProcessRoutes.put(
  '/finalizeProcess/:idProcess',
  authenticate,
  authorize('end-process'),
  controllers.processController.finalizeProcess,
);
ProcessRoutes.put(
  '/archiveProcess/:idProcess/:archiveFlag',
  authenticate,
  authorize('archive-process'),
  controllers.processController.archiveProcess,
);
ProcessRoutes.put(
  '/updateStage',
  authenticate,
  authorize('forward-stage'),
  controllers.processController.updateProcessStage,
);

ProcessRoutes.get(
  '/idFlow/:idFlow',
  authenticate,
  controllers.processController.getProcessesByIdFlow,
);
ProcessRoutes.get(
  '/keys/:idFlow/:record',
  authenticate,
  authorize('see-process'),
  controllers.processController.getProcessByUniqueKeys,
);
ProcessRoutes.get(
  '/priorities',
  authenticate,
  controllers.processController.getPriorityProcess,
);

/**
 * @deprecated Use getProcessById instead
 */
ProcessRoutes.get(
  '/record/:record',
  authenticate,
  controllers.processController.getProcessByRecord,
);

export default ProcessRoutes;
