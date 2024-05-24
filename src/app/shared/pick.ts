const pick = <T extends Record<string, unknown>, K extends keyof T>(
	query: T,
	keys: K[]
): Partial<T> => {
	// Initialize an empty object to store the extracted properties
	const finalQuery: Partial<T> = {};

	for (const key of keys) {
		// Check if the key exists in the query object
		if (Object.keys(query).length && Object.hasOwnProperty.call(query, key)) {
			finalQuery[key] = query[key];
		}
	}

	return finalQuery;
};

export default pick;
