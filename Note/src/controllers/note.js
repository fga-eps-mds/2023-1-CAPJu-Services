import services from '../services/_index.js';

export class NoteController {
  constructor() {
    this.noteService = services.noteService;
  }

  index = async (req, res) => {
    const { record } = req.params;
    try {
      const note = await this.noteService.findAllByRecord(record);
      return res.status(200).json(note);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao buscar observação: ${error}` });
    }
  };

  newNote = async (req, res) => {
    const { commentary, record, idStageA, idStageB } = req.body;
    try {
      const note = await this.noteService.create({
        commentary,
        record,
        idStageA,
        idStageB,
      });
      return res.status(200).json(note);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao criar observação: ${error}` });
    }
  };

  delete = async (req, res) => {
    const { idNote } = req.params;
    try {
      const note = await this.noteService.findOneByID(idNote);
      if (!note) {
        return res.status(400).json({ error: `idNote ${idNote} não existe!` });
      } else {
        await this.noteService.deleteNoteById(idNote);
        return res
          .status(200)
          .json({ message: 'Observação deletada com sucesso.' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao deletar observação: ${error}` });
    }
  };

  update = async (req, res) => {
    const { commentary } = req.body;
    const { idNote } = req.params;

    try {
      const updatedNote = await this.noteService.updateNote(commentary, idNote);
      if (updatedNote === false) {
        return res.status(400).json({ error: `idNote ${idNote} não existe!` });
      }
      return res
        .status(200)
        .json({ message: 'Observação atualizada com sucesso.' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao atualizar observação: ${error}` });
    }
  }
}
