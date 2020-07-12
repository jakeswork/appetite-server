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
const zomato_1 = require("../types/zomato");
const Zomato_1 = require("./Zomato");
class Restaurant {
    constructor(props) {
        var _a, _b, _c, _d;
        this.id = props.id;
        this.name = props.name;
        this.address = (_a = props.location) === null || _a === void 0 ? void 0 : _a.address;
        this.averageCostForTwo = props.average_cost_for_two;
        this.priceRange = props.price_range;
        this.image = props.featured_image;
        this.thumbnail = props.thumb;
        this.menuUrl = props.menu_url;
        this.hasOnlineDelivery = props.has_online_delivery;
        this.hasTableBooking = props.has_table_booking;
        this.url = props.url;
        this.cuisines = props.cuisines;
        this.highlights = props.highlights;
        this.phoneNumbers = props.phone_numbers;
        this.openHours = props.timings;
        this.deliveryOpen = Boolean(props.is_delivering_now);
        this.takeawayOpen = Boolean((_c = (_b = props.R) === null || _b === void 0 ? void 0 : _b.has_menu_status) === null || _c === void 0 ? void 0 : _c.takeaway);
        this.totalReviews = props.all_reviews_count;
        this.averageRating = (_d = props.user_rating) === null || _d === void 0 ? void 0 : _d.aggregate_rating;
        this.photosUrl = props.photos_url;
    }
    static findMany(cityId, cuisines, q, paginationStart) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Zomato_1.default.get('search', {
                entity_id: cityId,
                entity_type: zomato_1.ZomatoSearchEntities.CITY,
                cuisines,
                q,
                start: paginationStart,
            });
            if (!response)
                return null;
            return Restaurant.decorateWithMetaData(response.data);
        });
    }
    static findById(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Zomato_1.default.get('restaurant', {
                res_id: Number(restaurantId),
            });
            if (!response)
                return null;
            return new Restaurant(response.data);
        });
    }
    static decorateWithMetaData(data) {
        return {
            metadata: {
                totalResults: data.results_found,
                nextPageStart: data.results_start + data.results_shown,
                hasMoreResults: Boolean((data.results_start + data.results_shown) < data.results_found)
            },
            restaurants: data.restaurants.map(({ restaurant }) => new Restaurant(restaurant))
        };
    }
}
exports.default = Restaurant;
//# sourceMappingURL=Restaurant.js.map