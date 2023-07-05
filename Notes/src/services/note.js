class NoteService {
  constructor(NoteModel) {
    this.note = NoteModel;
  }

  async createNote(note) {
    return this.note.create(note);
  }

  async findAllByRecord(record) {
    return this.note.findAll({
      where: { record: record },
    });
  }

  async findOneByID(idNote) {
    return this.note.findOne({
      where: { idNote: idNote },
    });
  }

  async deleteNoteById(idNote) {
    return await this.note.destroy({ where: { idNote } });
  }

  async updateNote(commentary, idNote) {
    const [updatedRows] = await this.note.update(
      { commentary },
      { where: { idNote } },
    );
    if (updatedRows) {
      const updatedNote = await this.findOneByFlowId(idNote);
      return updatedNote;
    } else {
      return false;
    }
  }
}

export default NoteService;
