"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (query, keys) => {
    // Initialize an empty object to store the extracted properties
    const finalQuery = {};
    for (const key of keys) {
        // Check if the key exists in the query object
        if (Object.keys(query).length && Object.hasOwnProperty.call(query, key)) {
            finalQuery[key] = query[key];
        }
    }
    return finalQuery;
};
exports.default = pick;
