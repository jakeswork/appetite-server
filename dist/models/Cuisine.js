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
const Zomato_1 = require("./Zomato");
const MemoryCache_1 = require("../stores/MemoryCache");
const cache = new MemoryCache_1.default();
class Cuisine {
    constructor(props) {
        this.id = props.cuisine_id;
        this.name = props.cuisine_name;
    }
    static findManyByCityId(cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                endpoint: 'cuisines',
                params: { city_id: cityId }
            };
            if (cache.has(opts))
                return cache.get(opts);
            const response = yield Zomato_1.default.get(opts.endpoint, opts.params);
            if (!response)
                return [];
            const cuisines = response.data.cuisines.map(({ cuisine }) => new Cuisine(cuisine));
            return cache.set(opts, cuisines, { hours: 1 });
        });
    }
}
exports.default = Cuisine;
//# sourceMappingURL=Cuisine.js.map