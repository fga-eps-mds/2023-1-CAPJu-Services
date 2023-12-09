import { QueryTypes } from 'sequelize';
import sequelizeConfig from '../../src/config/sequelize.js';
import FlowUserService from '../../src/services/flowUser.js';

const FlowUserModel = {
  findAll: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../src/config/sequelize.js', () => ({
  query: jest.fn(),
}));

describe('FlowUserService', () => {
  let flowUserService;

  beforeEach(() => {
    flowUserService = new FlowUserService(FlowUserModel);
  });

  describe('findAll', () => {
    it(' Retornar uma lista de usuários do fluxo', async () => {
      FlowUserModel.findAll.mockResolvedValue([
        { idFlow: 1, cpf: '1234567890' },
        { idFlow: 2, cpf: '0987654321' },
      ]);

      const result = await flowUserService.findAll();

      expect(result).toEqual([
        { idFlow: 1, cpf: '1234567890' },
        { idFlow: 2, cpf: '0987654321' },
      ]);
      expect(FlowUserModel.findAll).toHaveBeenCalled();
    });
  });

  describe('createFlowUser', () => {
    it(' Criar um novo usuário do fluxo com o CPF e ID do fluxo fornecidos', async () => {
      const cpf = '1234567890';
      const idFlow = 1;
      FlowUserModel.create.mockResolvedValue({ cpf, idFlow });

      const result = await flowUserService.createFlowUser(cpf, idFlow);

      expect(result).toEqual({ cpf, idFlow });
      expect(FlowUserModel.create).toHaveBeenCalledWith({ cpf, idFlow });
    });
  });

  describe('deleteFlowUserById', () => {
    it(' Excluir o usuário do fluxo com o ID do fluxo fornecido', async () => {
      const idFlow = 1;
      FlowUserModel.destroy.mockResolvedValue();

      await flowUserService.deleteFlowUserById(idFlow);

      expect(FlowUserModel.destroy).toHaveBeenCalledWith({ where: { idFlow } });
    });
  });

  describe('findUsersToNotify', () => {
    it(' Retornar os usuários a serem notificados com base no ID do fluxo fornecido', async () => {
      const idFlow = 1;
      const query_results = [
        {
          idFlow: 1,
          cpf: '1234567890',
          fullName: 'John Doe',
          email: 'johndoe@example.com',
          idUnit: 1,
        },
        {
          idFlow: 1,
          cpf: '0987654321',
          fullName: 'Jane Smith',
          email: 'janesmith@example.com',
          idUnit: 2,
        },
      ];
      sequelizeConfig.query.mockResolvedValue(query_results);

      const result = await flowUserService.findUsersToNotify(idFlow);

      expect(result).toEqual(query_results);
      expect(sequelizeConfig.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          replacements: [idFlow],
          type: QueryTypes.SELECT,
        }),
      );
    });
  });
});
