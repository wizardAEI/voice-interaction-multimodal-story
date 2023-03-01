/*
 * @Date: 2023-01-15 12:08:01
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 22:21:01
 * @FilePath: \wtw-front\wtw-threejs\src\view\home\Home.tsx
 * @description:
 */
import axios from "axios";
import { parseAudioUrl } from "../../config/url";
import { useEffect, useState } from "react";
import { start, stop } from "../../utils/record";
import styled from "styled-components";
import "./Home.css";
import { init } from "../../three/test";
import hasAction from "../../three/parseActions/hasAction";

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
`


const actionsFn = {
  'jump': () => {},
  'turn right': () => {},
  'turn left': () => {},
  'no action': () => {}
}

export default function () {
  const [text, setText] = useState("hello!");
  useEffect(() => {
    const { jump, turn } = init();
    actionsFn['jump'] = jump
    actionsFn['turn left'] = () => turn('left')
    actionsFn['turn right'] = () => turn('right')
  }, []);
  async function changeText() {
    const blob = stop();
    let formData = new FormData();
    formData.append("file", blob, "file.pcm");
    const res = await axios({
      method: "post",
      url: parseAudioUrl + "/parse_audio",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    if(res.data.data?.result) {
      const results = res.data.data.result as string[]
      setText(results[0]);
      actionsFn[hasAction(results)]()
    }
  }
  return (
    <Container>
      <button className="recordButton green" onClick={start}>
        录制
      </button>
      <button className="stopButton purple" onClick={changeText}>
        暂停录制
      </button>
      <WebGlCanvas className="webgl-canvas"></WebGlCanvas>
      <Text>
        {text}
      </Text>
    </Container>
  );
}
