/*
 * @Date: 2023-04-12 21:56:50
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-04-13 00:10:43
 * @FilePath: \wtw-front\wtw-story\src\view\home\Home.tsx
 * @description: 
 */
import { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'

const Container = styled.div`

`;


export default function Home() {
  const nav = useNavigate()

  useEffect(() => {}, []);

  return (
    <Container>
      test story
    </Container>
  );
}
