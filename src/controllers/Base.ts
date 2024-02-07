import { Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import _ from 'lodash';
import mongoose from 'mongoose';

export default class BaseController {
  protected _model: mongoose.Model<mongoose.Document>;

  constructor(model: mongoose.Model<mongoose.Document>) {
    this._model = model;
  }

  generatePathToPopulate() {
    return _.keys(this._model.schema.obj)?.filter((path) => path !== '_id' && path !== '__v');
  }

  sanitizeQuery(query: any) {
    return mongoSanitize.sanitize(query);
  }

  sanitizeOutput(body: any, model: mongoose.Model<mongoose.Document>) {
    // return formatted data
    // { data: {pagedData, pageInfo, moreInfo} , message: 'success' }
    return {
      data: body,
      message: `Successfully fetched ${model.modelName} data`,
    };
  }

  async getAll(req: Request, res: Response) {
    try {
      const pathsToPopulate = this.generatePathToPopulate();
      const docs = await this._model.find().populate(pathsToPopulate);
      res.status(200).json(docs);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const doc = await this._model.create(data);
      const pathsToPopulate = this.generatePathToPopulate();
      const populatedDoc = await this._model.findById(doc._id).populate(pathsToPopulate);
      res.status(201).json(populatedDoc);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const pathsToPopulate = this.generatePathToPopulate();
      const doc = await this._model
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        ?.populate(pathsToPopulate);
      res.status(200).json(doc);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await this._model.findByIdAndDelete(id);
      res.status(204).json(doc);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }
}
