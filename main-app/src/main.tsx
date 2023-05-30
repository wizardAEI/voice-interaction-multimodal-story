/*
 * @Date: 2023-01-15 12:06:09
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-15 00:19:05
 * @FilePath: \wtw-front\main-app\src\main.tsx
 * @description: 
 */
import ReactDOM from 'react-dom/client'
import { registerMicroApps, start } from 'qiankun';
import './style.css'
import { BrowserRouter } from 'react-router-dom';
import Routes from './router';

// 监听子应用
registerMicroApps([
  {
    name: 'chat-app', // app name registered
    // entry: 'http://localhost:3011',
    entry: '/chat-app/',
    container: '#chat-app',
    activeRule: '/chat',
  },
  {
    name: 'story-app', // app name registered
    entry: '/story-app/',
    // entry: 'http://localhost:3013',
    container: '#story-app',
    activeRule: '/story',
  },
  {
    name: 'game-app', // app name registered
    entry: '/game-app/',
    // entry: 'http://localhost:3014',
    container: '#game-app',
    activeRule: '/game',
  },
  // {
  //   name: 'management-platform', // app name registered
  //   entry: 'http://localhost:3012',
  //   // entry: '/management-platform/',
  //   container: '#management-platform',
  //   activeRule: '/management-platform',
  // },
  // {
  //   name: 'story-app', // app name registered
  //   // entry: '/story-app/',
  //   entry: '/story-app/',
  //   container: '#story-app',
  //   activeRule: '/wow',
  // },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<BrowserRouter>
  <Routes/>
</BrowserRouter>)

start();