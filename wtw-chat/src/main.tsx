/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-04-08 17:30:58
 * @FilePath: \wtw-front\wtw-chat\src\main.tsx
 * @description:
 */
import ReactDOM, { Root } from "react-dom/client";
import Home from "./view/home/Home";
import "./style.css";
import "../../pkg/css/icon.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import VideoGame from "./view/videoGame/VideoGame";

let root: Root
function render(props: any) {
  const { container } = props;
  // Step 1: Create a root container
  root = ReactDOM.createRoot((container ? container.querySelector('#root') : document.querySelector('#root')) as HTMLElement)
  // Step 2: Pass the router to the root container
  root.render(
    <BrowserRouter
      basename={(window as any).__POWERED_BY_QIANKUN__ ? "/app-react" : "/"}
    >
      // Step 3: Define the router rules
      <Routes>
        <Route path="/chat" element={<Home />} />
        <Route path="/chat/wow" element={<VideoGame />} />
        <Route path="/chat/*" element={<Navigate to="/chat"/>} />
        <Route path="*"  element={<Navigate to="/chat"/>} />
      </Routes>
    </BrowserRouter>
  );
}

renderWithQiankun({
  mount(props) {
    console.log('mount');
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props: any) {
    console.log('unmount');
    root.unmount();
  },
  update(props) {
    console.log(props)
  }
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}