/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-14 17:45:46
 * @FilePath: \wtw-front\wtw-game\src\main.tsx
 * @description:
 */
import ReactDOM, { Root } from "react-dom/client";
import Home from "./view/home/Home";
import "./style.css";
import "../../pkg/css/icon.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import Video from "./view/video/Video";
import { store } from "./store/main";
import { Provider } from "react-redux";

let root: Root;
function render(props: any) {
  const { container } = props;
  root = ReactDOM.createRoot(
    (container
      ? container.querySelector("#root")
      : document.querySelector("#root")) as HTMLElement
  );
  root.render(
    <Provider store={store}>
      <BrowserRouter
        basename={(window as any).__POWERED_BY_QIANKUN__ ? "/app-react" : "/"}
      >
        <Routes>
          <Route path="/game" element={<Video />} />
          <Route path="/game/home" element={<Home />} />
          <Route path="/game/*" element={<Navigate to="/game" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

renderWithQiankun({
  mount(props) {
    console.log("mount");
    render(props);
  },
  bootstrap() {
    console.log("bootstrap");
  },
  unmount(props: any) {
    console.log("unmount");
    root.unmount();
  },
  update(props) {
    console.log(props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
