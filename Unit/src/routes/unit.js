import express from 'express';
import { UnitController } from '../controllers/unit.js';

const UnitRoutes = express.Router();
const unitController = new UnitController();

UnitRoutes.get('/units', unitController.getAllUnits);
UnitRoutes.post('/newUnit', unitController.store);
UnitRoutes.put('/updateUnit', unitController.update);
UnitRoutes.delete('/deleteUnit', unitController.delete);
UnitRoutes.get('/unitAdmins/:idUnit', unitController.getAdminsByUnitId);
UnitRoutes.put('/setUnitAdmin', unitController.setUnitAdmin);

export default UnitRoutes;
