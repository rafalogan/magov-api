import { config } from 'process';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		exclude: ['./old-files/**', 'node_modules/**'],
	},
	plugins: [tsconfigPaths()],
});
