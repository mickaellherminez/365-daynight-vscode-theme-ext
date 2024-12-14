process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { runTests, downloadAndUnzipVSCode } = require('@vscode/test-electron');

async function setExecutablePermissions(vsCodePath) {
	try {
		const baseDir = path.dirname(path.dirname(path.dirname(vsCodePath)));
		console.log('Base directory:', baseDir);
		
		if (process.platform === 'darwin') {
			const commands = [
				`chmod -R +x "${baseDir}"`,
				`xattr -rc "${baseDir}"`
			];

			for (const command of commands) {
				await new Promise(resolve => {
					exec(command, (error) => {
						if (error) {
							console.warn(`Warning executing ${command}:`, error);
						}
						resolve();
					});
				});
			}
		}
	} catch (error) {
		console.error('Error in setExecutablePermissions:', error);
		throw error;
	}
}

async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../');
		const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');
		const tmpDir = path.join(os.tmpdir(), 'vscode-test-workspace');

		await Promise.all([
			fs.rm(path.join(extensionDevelopmentPath, '.vscode-test'), { recursive: true, force: true }).catch(() => {}),
			fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
		]);

		const testOptions = {
			extensionDevelopmentPath,
			extensionTestsPath,
			version: '1.83.1',
			launchArgs: [
				'--no-sandbox',
				'--disable-gpu',
				'--skip-welcome',
				'--skip-release-notes',
				'--disable-updates',
				'--disable-workspace-trust',
				'--disable-telemetry',
				`--user-data-dir=${tmpDir}`
			]
		};

		if (process.platform === 'darwin' && process.arch === 'arm64') {
			testOptions.platform = 'darwin-arm64';
			testOptions.useInstallation = false;
		}

		console.log('Running tests with options:', testOptions);

		try {
			const vscodeExecutablePath = await downloadAndUnzipVSCode(testOptions.version, testOptions.platform);
			console.log('VS Code downloaded to:', vscodeExecutablePath);

			await setExecutablePermissions(vscodeExecutablePath);
			
			await new Promise(resolve => setTimeout(resolve, 3000));

			await runTests({
				...testOptions,
				vscodeExecutablePath
			});
			
			console.log('Tests completed successfully');
		} catch (error) {
			console.error('Test execution failed:', error);
			process.exit(1);
		}
	} catch (err) {
		console.error('Failed to run tests:', err);
		process.exit(1);
	}
}

main().catch(err => {
	console.error('Unhandled error:', err);
	process.exit(1);
});
