class PriorityService {
  constructor(PriorityModel) {
    this.priority = PriorityModel;
  }

  async findAll(where, attributes) {
    const query = {};
    if (where)
      query.where = where;
    if (attributes && attributes.length)
      query.attributes = attributes;

    return this.priority.findAll(query);
  }

}

export default PriorityService;
