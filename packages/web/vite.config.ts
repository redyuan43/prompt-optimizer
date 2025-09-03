import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量（从项目根目录加载）
  const env = loadEnv(mode, resolve(process.cwd(), '../../'))
  
  return {
    plugins: [vue()],
    server: {
      port: 18181,
      host: true,
      fs: {
        // 允许为工作区依赖提供服务
        allow: ['..']
      },
      hmr: true,
      watch: {
        // 确保监视monorepo中其他包的变化
        ignored: ['!**/node_modules/@prompt-optimizer/**']
      },
      proxy: {
        // 代理API请求到本地代理服务器
        '/api/proxy': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          rewrite: (path) => path
        },
        '/api/stream': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          rewrite: (path) => path
        },
        // 添加代理状态检测API
        '/api/vercel-status': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 直接返回可用状态
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({
                status: 'available',
                environment: 'development',
                proxySupport: true,
                version: '1.0.0'
              }));
            });
          }
        }
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      }
    },
    publicDir: 'public',
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': resolve(__dirname, 'src'),
        '@prompt-optimizer/core': path.resolve(__dirname, '../core'),
        '@prompt-optimizer/ui': path.resolve(__dirname, '../ui'),
        '@prompt-optimizer/web': path.resolve(__dirname, '../web'),
        '@prompt-optimizer/extension': path.resolve(__dirname, '../extension')
      }
    },
    optimizeDeps: {
      // 预构建依赖
      include: ['element-plus'],
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        ...Object.keys(env).reduce((acc, key) => {
          acc[key] = env[key];
          return acc;
        }, {})
      }
    }
  }
})