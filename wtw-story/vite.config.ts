/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-04-24 20:20:33
 * @FilePath: \wtw-front\wtw-story\vite.config.ts
 * @description:
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config(); // 解析env
import qiankun from "vite-plugin-qiankun";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // 生产环境需要指定运行域名作为base
    base:
      mode === "development"
        ? "http://localhost:" + process.env.PORT + "/"
        : "/story-app/",
    server: {
      cors: true,
      origin: "http://localhost:" + process.env.PORT,
      port: process.env.PORT as unknown as number,
    },
    build: {
      outDir: "../../web-project/wtw-front/story-app",
      emptyOutDir: true,
    },
    plugins: [
      react(),
      // TODO 生产不行就去掉这里注释
      qiankun("story-app", {
        useDevMode: mode === "development" ? true : false,
      }),
    ],
  };
});
