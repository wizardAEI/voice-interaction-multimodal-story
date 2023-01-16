/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 00:12:51
 * @FilePath: \wtw-front\wtw-threejs\vite.config.ts
 * @description:
 */
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
dotenv.config(); // 解析env
import qiankun from "vite-plugin-qiankun";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), qiankun("threejs-app", {
    useDevMode: true
  })],
  // 生产环境需要指定运行域名作为base
  base: "/",
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://127.0.0.1:9003',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
      // }
    },
    origin: "http://127.0.0.1:3011",
    port: process.env.PORT as unknown as number,
  },
  build: {
    outDir: '../docker/threejs-app'
  },
  
});
