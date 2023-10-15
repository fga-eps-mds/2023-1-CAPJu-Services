export class UnitService {

    constructor(UnitModel) {
        this.repository = UnitModel;
    }

    findAll(where, attributes) {
        const query = { where };

        if (attributes && attributes.length) {
            query.attributes = attributes;
        }

        return this.repository.findAll(query);
    }

}