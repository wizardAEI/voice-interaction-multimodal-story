/*
 * @Date: 2023-01-15 12:06:09
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-15 17:43:59
 * @FilePath: \wtw-front\main-app\vite.config.ts
 * @description: 
 */
import dotenv from 'dotenv'
dotenv.config() // 解析env
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT as unknown as number,
    // TODO 优化跨域策略
    cors: true
  },
  build: {
    outDir: '../docker/main-app'
  }
})
