import { Router } from 'express';
import UnitController from '../controllers/unit.js';

const routes = Router();

routes.get('/units', UnitController.index);
routes.get('/unitAdmins/:id', UnitController.getAdminsByUnitId);

routes.post('/newUnit', UnitController.store);

routes.put('/updateUnit', UnitController.update);

routes.delete('/deleteUnit', UnitController.delete);

export default routes;
