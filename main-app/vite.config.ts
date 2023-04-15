/*
 * @Date: 2023-01-15 12:06:09
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-20 21:46:12
 * @FilePath: \wtw-front\main-app\vite.config.ts
 * @description: 
 */
import dotenv from 'dotenv'
dotenv.config() // 解析env
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  plugins: [react()],
  server: {
    port: process.env.PORT as unknown as number,
    cors: true
  },
  build: {
    outDir: '../../web-project/wtw-front/main-app',
    emptyOutDir: true
  }
}))
