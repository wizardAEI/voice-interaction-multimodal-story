/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-01 20:12:24
 * @FilePath: \wtw-front\wtw-admin\src\view\home\Home.tsx
 * @description:
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import "./Home.css";

// css
const Container = styled.div`
  display: flex;
  justify-content: center;
  div {
    background-color: aqua;
  }
`;

export default function () {
  return (
    <Container>
      <div>login: admin</div>
      <div>
        子路由:
        <Outlet />
      </div>
    </Container>
  );
}
