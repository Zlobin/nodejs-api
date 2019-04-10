class CRUD {
  constructor (model, fields = [], perPage = 10) {
    if (!model) {
      throw new Error('No model');
    }
    this._model = model;
    this._fields = fields;
    this._fieldsToFind = fields;
    this._related = []
    this._perPage = perPage;
  }
  _fill (payload) {
    const result = {};
    this._fields.forEach(field => (result[field] = payload[field]));
    return result;
  }
  setFieldToFind (fields = []) {
    this._fieldsToFind = fields;
  }
  setRelated (related = []) {
    this._related = related;
  }
  async find (req, res) {
    const { page = 1 } = req.query;
    let response = { success: true };

    try {
      response.payload = {};
      response.payload.items = await this._model
        .find()
        .select([...this._fieldsToFind, ...['createdAt', 'updatedAt']])
        .populate(...this._related)
        .skip(this._perPage * (+page - 1))
        .limit(this._perPage);
      response.payload.page = +page;
      response.payload.limit = this._perPage;
      response.payload.total = await this._model.count();
    } catch (e) {
      response = {
        success: false,
        error: `Error when getting ${this.constructor.name}. ${e}`
      };
    }

    res.json(response);
  }
  async create (req, res) {
    const { payload } = req.body || {};
    let response = { success: true };

    try {
      await this._model.create(this._fill(payload));
    } catch (e) {
      response = {
        success: false,
        error: `Error when creating ${this.constructor.name}. ${e}`
      };
    }

    res.json(response);
  }
  async update (req, res) {
    const { payload } = req.body || {};
    const { id: _id } = payload;
    let response = { success: true };

    try {
      await this._model.findOneAndUpdate({ _id }, this._fill(payload));
    } catch (e) {
      response = {
        success: false,
        error: `Error when updating ${this.constructor.name}. ${e}`
      };
    }

    res.json(response);
  }
  async delete (req, res) {
    const { id: _id } = req.body.payload || {};
    let response = { success: true };

    try {
      await this._model.deleteOne({ _id });
    } catch (e) {
      response = {
        success: false,
        error: `Error when deleting ${this.constructor.name} #${_id}. ${e}`
      };
    }

    res.json(response);
  }
}

module.exports = CRUD;
