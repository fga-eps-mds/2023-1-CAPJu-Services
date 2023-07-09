import express from 'express';
import controllers from '../controllers/_index.js';

const UnitRoutes = express.Router();

UnitRoutes.get('/', controllers.unitController.index);
UnitRoutes.get(
  '/unitAdmins/:idUnit',
  controllers.unitController.showAdminsByUnitId,
);
UnitRoutes.post('/setUnitAdmin', controllers.unitController.setUnitAdmin);
UnitRoutes.post('/removeUnitAdmin', controllers.unitController.removeUnitAdmin);
UnitRoutes.post('/newUnit', controllers.unitController.store);
UnitRoutes.put('/updateUnit', controllers.unitController.update);
UnitRoutes.delete('/deleteUnit', controllers.unitController.delete);

export default UnitRoutes;
