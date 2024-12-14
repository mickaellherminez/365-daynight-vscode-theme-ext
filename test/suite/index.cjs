const path = require('path');
const Mocha = require('mocha');
const { glob } = require('glob');

async function run() {
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');
	
	try {
		const files = await glob('**/*.test.cjs', { cwd: testsRoot });
		files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

		return new Promise((resolve, reject) => {
			mocha.run(failures => {
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`));
				} else {
					resolve();
				}
			});
		});
	} catch (err) {
		console.error('Error during test suite execution:', err);
		throw err;
	}
}

module.exports = {
	run
};
