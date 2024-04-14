import { Request, Response } from 'express';
import mongoose,{ Model } from 'mongoose';

class BaseController<ModelType> {
  itemModel: mongoose.Model<ModelType>;
  constructor(itemModel: mongoose.Model<ModelType>) {
      this.itemModel = itemModel;
  }

  async post(req: Request, res: Response) {
    console.log(req.body);
    const obj = new this.itemModel(req.body);
    
    try {
      const savedObj = await obj.save();
      res.status(201).json(savedObj);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
}


export default BaseController;