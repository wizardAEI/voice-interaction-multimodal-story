/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-04-13 00:14:03
 * @FilePath: \wtw-front\wtw-story\src\main.tsx
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

let root: Root
function render(props: any) {
  const { container } = props;
  root = ReactDOM.createRoot((container ? container.querySelector('#root') : document.querySelector('#root')) as HTMLElement)
  root.render(
    <BrowserRouter
      basename={(window as any).__POWERED_BY_QIANKUN__ ? "/app-react" : "/"}
    >
      <Routes>
        <Route path="/story" element={<Home />} />
        <Route path="/story/*" element={<Navigate to="/story"/>} />
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