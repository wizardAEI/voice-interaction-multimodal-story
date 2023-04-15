import { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { nodeServerUrl } from "../../../../pkg/config/url";
import { zIndexDefine } from "../../../../pkg/css/define";
import { ChatMessage } from "./model";
import { start as recordStart, stop as recordStop } from "../../utils/record";
import axios from "axios";
import { chatBac } from "../../config/define";
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-image: url(${nodeServerUrl + "/assets/chat/bac/forest.png"});
  background-size: cover;
  height: 100vh;
  .voice {
    position: absolute;
    z-index: ${zIndexDefine.topOne};
    bottom: 50px;
    border-radius: 50%;
    box-shadow: 0px 0px 6px 6px rgba(186, 180, 110, 0.8);
    transition: 0.5s;
  }
  .voice:hover {
    transform: scale(1.1);
  }
  .voice-click {
    transform: scale(1.05) !important;
    transition: 0.3s;
  }
  .voice-click:after {
    content: "";
    background: trasparent;
    width: 140%;
    height: 140%;
    position: absolute;
    border-radius: 100%;
    top: -20%;
    left: -20%;
    opacity: 0.7;
    box-shadow: rgba(186, 180, 110, 0.8) -4px -5px 3px -3px;
    animation: rotate 2s infinite linear;
  }
  @keyframes rotate {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  .button-voice {
    height: 70px;
    width: 70px;

    display: flex;
    border-radius: 50%;
    background-image: url(${nodeServerUrl + "/assets/chat/img/m.png"});
    background-size: cover;
  }
  .button-voice {
    outline: none;
    border: none;
  }
  .mask {
    height: 100vh;
    width: 100vw;
    background-color: black;
    opacity: 0;
    animation: fadeOut 0.5s;
  }
  .maskAhead {
    opacity: 0.75;
    animation: fadeIn 0.5s;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.75;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 0.75;
    }
    to {
      opacity: 0;
    }
  }
`;
const ChatBox = styled.div`
  position: fixed;
  height: 100vh;
  width: 100%;
  max-width: 1400px;
  padding: 100px 100px 200px 100px;
  font-size: 20px;
  font-family: "cat";
  color: #464646;
  overflow-y: scroll;
  transition: 0.5s;
  // 不在内部独立一个box无法实现滚动条
  .box {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .avatar {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    box-shadow: 0 0 3px 3px rgba(222, 214, 214, 0.6);
  }
  .chat-box {
    display: flex;
    margin-bottom: 40px;
    animation: jump 0.5s;
  }
  .chat-box .chat-box__message {
    padding: 18px;
    background-color: #f9f2a5;
    border-radius: 30px;
    margin: 0 30px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .chat-box.child {
    flex-direction: row-reverse;
    justify-content: end;
  }
  .chat-box__message {
    position: relative;
    min-width: 80px;
    animation: fadeIn 0.5s;
  }
  .chat-box.child .chat-box__message::after {
    content: "";
    display: block;
    position: absolute;
    top: 24px;
    right: 0;
    border-left: 18px solid #f9f2a5;
    border-top: 9px solid #25e02800 !important;
    border-bottom: 9px solid #f4035500;
    border-top: 0;
    transform: translateX(14px);
  }
  .chat-box.bot .chat-box__message::before {
    content: "";
    display: block;
    position: absolute;
    top: 24px;
    left: 0;
    border-right: 18px solid #f9f2a5;
    border-top: 9px solid #25e02800 !important;
    border-bottom: 9px solid #f4035500;
    border-top: 0;
    transform: translateX(-14px);
  }
  @keyframes jump {
    0% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const avatars = {
  fox: nodeServerUrl + "/assets/chat/characters/fox_explore.png",
  baby: nodeServerUrl + "/assets/chat/characters/baby.png ",
};

const messageArr: ChatMessage = [
  {
    id: 0,
    avatar: avatars.fox,
    message: "我是小狐狸",
    type: "bot",
  },
  {
    id: 1,
    avatar: avatars.baby,
    message:
      "你好啊，小狐狸。我有很多话想和你讲。你知道吗，我的梦和天上的星星一样数也数不完...可是它们都在早晨七点三十分的时候倏的一下消失了",
    type: "child",
  },
  {
    id: 2,
    avatar: avatars.fox,
    message:
      "梦和星星都是属于一个神秘的精灵国度的。每晚当你入睡时，这些精灵们会把你的梦和星星收集起来，把它们带回到他们的国度里。在那里，他们会仔细照看和呵护这些梦和星星，直到早晨，他们会把所有的梦和星星放回到你的心里和天空里，让你可以继续拥有美好的梦境和璀璨的星空。",
    type: "bot",
  },
];

// chatGpt Require
let question = '', parent_id = '', system_message = chatBac

export default function Home() {
  const nav = useNavigate()
  // record
  const [voiceClass, setVoiceClass] = useState("voice");
  const [maskCLass, setMaskCLass] = useState("mask");
  const [messages, setMessages] = useState(messageArr);
  const mask = useRef(null);
  // Sound control
  const audioRef = useRef(null);
  let audioDom: any
  useEffect(() => {
     audioDom = audioRef.current as any;
  })
  // message box
  const messageBoxRef = useRef(null);
  function addClass() {
    setVoiceClass("voice-click voice");
    (mask.current as any).style.zIndex = zIndexDefine.centerTop;
    setMaskCLass("mask maskAhead");
    var src = nodeServerUrl + "/assets/voice_effect/microphone_start.mp3";
    audioDom.src = src;
    audioDom.play();
    recordStart();
  }
  // parseVoice and removeClass
  async function removeClass() {
    setMaskCLass("mask");
    var src = nodeServerUrl + "/assets/voice_effect/chat_out.mp3";
    audioDom.src = src;
    const blob = recordStop();
    const buffer = await blob.arrayBuffer();
    const file = Array.prototype.slice.call(new Uint8Array(buffer)); // buffer转array
    // 解析音频
    const { data } = await axios({
      method: "post",
      url: nodeServerUrl + "/parse_audio",
      data: {
        file,
      },
    });
    console.log(data)
    setVoiceClass("voice")
    audioDom.play()
    question = data.data?.result[0];
    (mask.current as any).style.zIndex = zIndexDefine.bottomOne;
    messages.push({
      id: messages.length,
      avatar: avatars.baby,
      message: question || '...',
      type: "child",
    });
    setMessages(messages);
    // (messageBoxRef.current as any).scrollTop = (
    //   messageBoxRef.current as any
    // ) .scrollHeight;
    question && (await answerQuestion())
  }
  async function answerQuestion() {
    let message = ''
    // loading animation
    const timer = setInterval(() => {
      if(message === '') {
        message += '.'
        messages.push({
          id: messages.length,
          avatar: avatars.fox,
          message,
          type: "bot",
        });
        return
      }
      message === '...' && (message = '')
      message += '.'
      messages[messages.length - 1].message = message;
      setMessages([...messages]);
      (messageBoxRef.current as any).scrollTop = (
        messageBoxRef.current as any
      ) .scrollHeight;
      // console.log(messages)
    }, 500)
    const { data } = await axios({
      method: "get",
      url: nodeServerUrl + "/chat_withme" + 
      "?question=" + question + "&parent_id=" + parent_id + "&system_message=" + system_message,
    });
    clearInterval(timer)
    // Determine if a edirect is required
    let needRedirect = {
      isNeed: false,
      to: ''
    }
    message = data.data?.text
    if(message.includes('{redirectToAVG}')) {
      needRedirect.isNeed = true
      needRedirect.to = '/story'
      message = message.replace('{redirectToAVG}', '')
    }
    if(message.includes('{redirectToGame}')) {
      needRedirect.isNeed = true
      needRedirect.to = '/chat/wow'
      message = message.replace('{redirectToGame}', '')
    }
    messages[messages.length - 1] = {
      id: 2358 + messages[messages.length - 1].id,
      message: message,
      type: 'bot',
      avatar: avatars.fox
    }
    parent_id = data.data?.id
    // voice answer
    const voiceRes = await axios({
      method: "get",
      url: nodeServerUrl + "/text_to_audio" + 
      "?msg=" + message,
    });
    if(voiceRes.data.msg === 'ok') {
      let audioBlob = new Blob([new Int8Array(voiceRes.data.data?.data)], {
        type: "autio/wave",
      });
      var src = URL.createObjectURL(audioBlob);
      audioDom.src = src;
      audioDom.play();
    }
    setMessages(messages);
    setTimeout(() => {
      (messageBoxRef.current as any).scrollTop = (
        messageBoxRef.current as any
      ) .scrollHeight;
    })
    needRedirect.isNeed && (audioDom.onended = () => {nav(needRedirect.to)})
  }

  useEffect(() => {}, []);

  return (
    <Container>
      <div ref={mask} className={maskCLass}></div>
      <div
        className={voiceClass}
        onTouchStart={addClass}
        onTouchEnd={removeClass}
        onMouseDown={addClass}
        onMouseUp={removeClass}
      >
        <button className="button-voice" />
      </div>
      <audio ref={audioRef}></audio>
      <ChatBox ref={messageBoxRef}>
        <div className="box">
          {messages.map((val): ReactElement => {
            return (
              <div className={"chat-box " + val.type} key={val.id}>
                <img src={val.avatar} className="avatar" />
                <div className="chat-box__message">{val.message}</div>
              </div>
            );
          })}
        </div>
      </ChatBox>
    </Container>
  );
}
