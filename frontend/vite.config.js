import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [
            react(),
            process.env.ANALYZE ? visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }) : null
        ].filter(Boolean),
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        server: {
            port: 5173,
            host: true,
            proxy: {
                // Proxy API calls to Django backend in dev
                '/api': {
                    target: 'http://127.0.0.1:8000',
                    changeOrigin: true,
                    // If backend serves /api/... we can keep rewrite as identity; adjust if needed
                    rewrite: function (path) { return path; }
                }
            }
        },
        preview: {
            port: 5173
        }
    });
});
