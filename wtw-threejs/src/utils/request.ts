/*
 * @Date: 2023-01-15 23:38:54
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 00:13:01
 * @FilePath: \wtw-front\wtw-threejs\src\utils\request.ts
 * @description:
 */
import axios from "axios";

// 配置默认URL
const service = axios.create({
  baseURL: "http://127.0.0.1:9003",
  timeout: 6000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;