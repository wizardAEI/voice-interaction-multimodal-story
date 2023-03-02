/*
 * @Date: 2023-03-01 15:56:50
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-01 21:21:41
 * @FilePath: \wtw-front\main-app\src\router.tsx
 * @description:
 */
import { Navigate, useRoutes } from "react-router-dom";
import ChatApp from "./views/ChatApp";
import Home from "./views/home/Home";
import ManagementPlatform from "./views/ManagementPlatform";
import StoryApp from "./views/StoryApp";

export default function Routes() {
  // 路由配置
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "/chat",
      element: <ChatApp />,
      children: [{ path: "*", element: <Navigate to="/chat" /> }],
    },
    {
      path: "/management-platform",
      element: <ManagementPlatform />,
      children: [
        { path: "son", element: <ManagementPlatform /> },
        { path: "*", element: <Navigate to="/management-platform" /> },
      ],
    },
    {
      path: "/story",
      element: <StoryApp />,
      children: [
        { path: "*", element: <Navigate to="/story" /> },
      ],
    },
    {
        path: "/*",
        element: <Navigate to=""/>,
    }
  ]);

  return routes;
}
