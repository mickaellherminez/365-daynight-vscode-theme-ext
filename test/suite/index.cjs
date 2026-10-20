const path = require('path');
const { glob } = require('glob');

async function run() {
	// Mocha 12 est un module ES : import() fonctionne aussi sous le Node de VS Code
	const { default: Mocha } = await import('mocha');
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');
	
	try {
		const files = await glob('**/*.test.cjs', { cwd: testsRoot });
		files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
		await mocha.loadFilesAsync();

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
