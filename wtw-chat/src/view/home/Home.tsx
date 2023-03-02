/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-03 00:45:22
 * @FilePath: \wtw-front\wtw-chat\src\view\home\Home.tsx
 * @description:
 */
import axios from "axios";
import { chatBac } from "../../config/define";
import { parseAudioUrl } from "../../../../pkg/config/url";
import { useEffect, useRef, useState } from "react";
import { start, stop } from "../../utils/record";
import styled from "styled-components";
import "./Home.css";

// css
const Container = styled.div`
  display: flex;
  justify-content: center;
  button {
    position: fixed;
    z-index: 2;
    top: 10px;
  }
  button {
    border: 0;
    margin: 20px;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: bold;
    padding: 15px 50px;
    border-radius: 50px;
    color: white;
    outline: none;
    position: relative;
  }
  button:before {
    content: "";
    display: block;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.4) 50%
    );
    background-size: 210% 100%;
    background-position: right bottom;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 50px;
    transition: all 1s;
    -webkit-transition: all 1s;
  }
  .green {
    background-image: linear-gradient(to right, #25aae1, #40e495);
    box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
  }
  .purple {
    background-image: linear-gradient(to right, #6253e1, #852d91);
    box-shadow: 0 4px 15px 0 rgba(236, 116, 149, 0.75);
  }

  .purple:hover:before {
    background-position: left bottom;
  }

  .green:hover:before {
    background-position: left bottom;
  }
  .recordButton {
    right: clac(50% - 150px);
  }
  .stopButton {
    left: clac(50% + 150px);
  }
`;
const WebGlCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
`;
const Text = styled.span`
  font-size: larger;
  position: fixed;
  z-index: 2;
  bottom: 30px;
  right: 20px;
  color: aliceblue;
`;

let parentId = "",
  systemMessage = chatBac,
  conversationId = "";

// TODO 定义返回模型
export default function Home() {
  // 声音控件
  const audioRef = useRef(null);

  const [text, setText] = useState("hello!");
  useEffect(() => {}, []);
  async function chat() {
    const blob = stop();
    const buffer = await blob.arrayBuffer();
    const file = Array.prototype.slice.call(new Uint8Array(buffer)); // buffer转array
    // 解析音频
    const { data } = await axios({
      method: "post",
      url: parseAudioUrl + "/chat_together",
      data: {
        file,
        parent_id: parentId,
        system_message: systemMessage,
        conversation_id: conversationId,
      },
    });
    if (data.code !== 0) {
      setText("出现了一点问题...");
      return;
    }
    const res = data.data;
    (parentId = res.id),
      (conversationId = res.conversationId),
      (systemMessage = "");
    const question = res.question as string;
    const answer = res.answer as string;
    // 打印说的话和回答的话
    setText("Q: " + question + "\n" + "A: " + answer);
    // 播放回答
    let audioBlob = new Blob([new Int8Array(res?.data.data)], {
      type: "autio/wave",
    });
    var src = URL.createObjectURL(audioBlob);
    const audioDom = audioRef.current as any;
    audioDom.src = src;
    audioDom.play();
  }
  return (
    <Container>
      <button className="recordButton green" onClick={start}>
        录制
      </button>
      <button className="stopButton purple" onClick={chat}>
        暂停录制
      </button>
      <WebGlCanvas className="webgl-canvas"></WebGlCanvas>
      <Text>{text}</Text>
      <audio ref={audioRef}></audio>
    </Container>
  );
}
