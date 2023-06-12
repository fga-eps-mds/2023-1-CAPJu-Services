import models from '../models/_index.js';
import UnitService from './unit.js';

const unitService = new UnitService(models.Unit);
const services = {
  unitService,
};

export default services;
