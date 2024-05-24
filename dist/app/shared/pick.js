"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (query, keys) => {
    const finalQuery = {};
    for (const key of keys) {
        if (Object.keys(query).length && Object.hasOwnProperty.call(query, key)) {
            finalQuery[key] = query[key];
        }
    }
    return finalQuery;
};
exports.default = pick;
