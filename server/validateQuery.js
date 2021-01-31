exports.validateQuery = async (inputs, regex) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < inputs.length; i++) {
			if (!inputs[i].match(regex))
				resolve(false);
		}
		resolve(true);
	});
}
