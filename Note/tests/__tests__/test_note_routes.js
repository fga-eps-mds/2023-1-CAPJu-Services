import { NoteController } from '../../src/controllers/note.js';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("role endpoints", () => {
  let noteController;

  beforeEach(() => {
    noteController = new NoteController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("newNote - create new note", async () => {
    const testNote = {
      commentary: "obs",
      record: "123",
      idStageA: 1,
      idStageB: 2,
    };

    noteController.noteService.create = jest
      .fn()
      .mockResolvedValue(testNote);

    reqMock.body = testNote;
    await noteController.newNote(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith(testNote);
  });

  test("newNote - failed to create new note", async () => {
    const testNote = {
      commentary: "obs",
      record: "123",
      idStageA: 1,
      idStageB: 2,
    };

    const errorMessage = "Database error";
    noteController.noteService.create = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    reqMock.body = testNote;
    await noteController.newNote(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: `Erro ao criar observação: Error: ${errorMessage}`
    });
  });

  test("index - list existing notes", async () => {
    const testNote = {
      commentary: "obs",
      record: "123",
      idStageA: 1,
      idStageB: 2,
    };

    noteController.noteService.findAllByRecord = jest
      .fn()
      .mockResolvedValue(testNote);

    reqMock.params = { record: testNote.record };
    await noteController.index(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith(testNote);
  });

  test("index - failed to list existing notes", async () => {
    const errorMessage = "Database error";
    noteController.noteService.findAllByRecord = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    reqMock.params = { record: '123' };
    await noteController.index(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: `Erro ao buscar observação: Error: ${errorMessage}`
    });
  });

  test("update - change commentary", async () => {
    const testNote = {
      commentary: "obs",
      record: "123",
      idStageA: 1,
      idStageB: 2,
    };

    noteController.noteService.updateNote = jest
      .fn()
      .mockResolvedValue(testNote);

    reqMock.body = { commentary: testNote.commentary };
    reqMock.params = { idNote: 1 };
    await noteController.update(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ message: 'Observação atualizada com sucesso.' });
  });

  test("update - failed to change commentary", async () => {
    const errorMessage = "Database error";
    noteController.noteService.updateNote = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    reqMock.body = { commentary: "obs2" };
    reqMock.params = { idNote: 1 };
    await noteController.update(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: `Erro ao atualizar observação: Error: ${errorMessage}`
    });
  });

  test("update - note not found", async () => {
    noteController.noteService.updateNote = jest
      .fn()
      .mockResolvedValue(false);

    const idNote = 1;
    reqMock.body = { commentary: "obs2" };
    reqMock.params = { idNote };
    await noteController.update(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.json).toHaveBeenCalledWith({
      error: `idNote ${idNote} não existe!`
    });
  });

  test("delete - remove note", async () => {
    const testNote = {
      commentary: "obs",
      record: "123",
      idStageA: 1,
      idStageB: 2,
    };

    noteController.noteService.findOneByID = jest
      .fn()
      .mockResolvedValue(testNote);
    noteController.noteService.deleteNoteById = jest
      .fn()
      .mockResolvedValue();

    reqMock.params = { idNote: 1 };
    await noteController.delete(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ message: 'Observação deletada com sucesso.' });
  });

  test("delete - failed to remove note", async () => {
    const errorMessage = "Database error";
    noteController.noteService.findOneByID = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    reqMock.params = { idNote: 1 };
    await noteController.delete(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: `Erro ao deletar observação: Error: ${errorMessage}`
    });
  });

  test("delete - note not found", async () => {
    noteController.noteService.findOneByID = jest
      .fn()
      .mockResolvedValue(false);

    const idNote = 1;
    reqMock.params = { idNote };
    await noteController.delete(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.json).toHaveBeenCalledWith({
      error: `idNote ${idNote} não existe!`
    });
  });
});
