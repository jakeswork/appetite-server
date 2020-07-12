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
const express_1 = require("express");
const Restaurant_1 = require("../../models/Restaurant");
const router = express_1.Router();
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cityId, cuisines = '', searchQuery = '', paginationStart = 0, } = req.query;
    if (!cityId) {
        res.status(400);
        return res.send('Please provide a city id.');
    }
    const response = yield Restaurant_1.default.findMany(cityId.toString(), cuisines.toString(), searchQuery.toString(), Number(paginationStart));
    return res.send(response);
}));
exports.default = router;
//# sourceMappingURL=restaurants.js.map