/*
 * @Date: 2023-01-15 12:06:09
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-02-12 16:20:27
 * @FilePath: \wtw-front\main-app\src\main.tsx
 * @description: 
 */
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerMicroApps, start } from 'qiankun';
import './style.css'
// 监听子应用
registerMicroApps([
  {
    name: 'threejs-app', // app name registered
    entry: 'http://localhost:3011',
    // entry: '/threejs-app/',
    container: '#threejs-app',
    activeRule: '/',
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />,
)

start();