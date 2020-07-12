"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;
class Zomato {
    static get(endpoint, params) {
        return axios_1.default.get(`https://developers.zomato.com/api/v2.1/${endpoint}`, {
            params,
            headers: {
                'user-key': ZOMATO_API_KEY
            }
        });
    }
}
exports.default = Zomato;
//# sourceMappingURL=Zomato.js.map