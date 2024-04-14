"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const obj = new this.itemModel(req.body);
            try {
                const savedObj = yield obj.save();
                res.status(201).json(savedObj);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: error });
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map