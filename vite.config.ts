import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['components', 'hooks', 'stores', 'types', 'index.ts'],
            exclude: ['**/*.test.ts', '**/*.test.tsx', 'examples', 'pages'],
            tsconfigPath: './tsconfig.lib.json',
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'BabelCatalogue',
            fileName: (format) => `index.${format === 'es' ? 'es' : 'umd'}.js`,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    three: 'THREE',
                    '@react-three/fiber': 'ReactThreeFiber',
                    '@react-three/drei': 'ReactThreeDrei',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
