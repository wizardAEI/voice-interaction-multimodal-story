/*
 * @Date: 2023-05-01 21:55:26
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-15 01:00:44
 * @FilePath: \wtw-front\wtw-game\src\view\video\Video.tsx
 * @description:
 */
import { nodeServerUrl } from "../../../../pkg/config/url";
import { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { zIndexDefine } from "../../../../pkg/css/define";
import { ChatMessage } from "./model";
import { start as recordStart, stop as recordStop } from "../../utils/record";
import axios from "axios";
import { storyBac } from "../../config/define";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../store/voice";
import { RootState } from "../../store/main";

const Container = styled.div`
  /* background-color: #000; */
  background-image: url(${nodeServerUrl + "/assets/game/room.png"});
  background-size: cover;
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;

  .tv {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    z-index: ${zIndexDefine.centerTop};
  }

  .tv__antenna {
    width: 200px;
    height: 200px;
    border-left: 12px solid black;
    border-bottom: 12px solid black;
    transform: rotate(-45deg) translateX(25px) translateY(-28px);
    margin: 0 auto;
  }

  .tv__antenna-base {
    width: 300px;
    height: 10px;
    border-radius: 5px 5px 0px 0px;
    background: black;
    margin: 0 auto;
  }

  .tv__box {
    width: calc(730px * 1.5 + 25px);
    height: calc(510px * 1.5 + 25px);
    background: #cca705;
    border-radius: 15px;
  }
  .tv__screen {
    width: calc(720px * 1.5);
    height: calc(500px * 1.5);
    margin: 0 auto;
    position: relative;
    background: black;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid black;
    border-radius: 15px;
    overflow: hidden;
    video {
      width: calc(736px * 1.5);
      height: calc(500px * 1.5);
      position: absolute;
      left: -12px;
    }
  }

  .tv__leg {
    width: 20px;
    height: 80px;
    background: black;
    position: absolute;
    border-radius: 5px;
  }
  .tv__leg:first-child {
    left: 150px;
    bottom: -70px;
    transform: rotate(25deg);
  }
  .tv__leg:last-child {
    right: 150px;
    bottom: -70px;
    transform: rotate(-25deg);
  }
  // play button have click animation
  .play {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    width: 100px;
    height: 100px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transform: translate(-50%, -50%);
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  .play:hover {
    animation: click 0.5s;
  }
  @keyframes click {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
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
    cursor: pointer;
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
  width: 100vw;
  padding: 100px 50px 350px 50px;
  font-size: 20px;
  font-family: "cat";
  color: #464646;
  overflow-y: scroll;
  transition: 0.5s;
  // the first div to make after div in the bottom
  > div:first-child {
    height: calc(100vh - 300px - 300px);
  }
  // 不在内部独立一个box无法实现滚动条
  .box {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .avatar {
    height: 0px;
    width: 0px;
    /* border-radius: 50%;
    box-shadow: 0 0 3px 3px rgba(222, 214, 214, 0.6); */
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
    max-width: 350px;
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

const Avatars = styled.div`
  position: absolute;
  width: 100vw;
  z-index: ${zIndexDefine.centerTop};
  bottom: 0px;
  margin: 0 20px;
  display: flex;
  justify-content: space-between;
  img {
    height: 250px;
    width: 250px;
    display: block;
  }
`;

const avatars = {
  fox: nodeServerUrl + "/assets/chat/characters/fox_nobac.png",
  baby: nodeServerUrl + "/assets/chat/characters/baby_nobac.png ",
};

const messageArr: ChatMessage = [
  {
    id: 0,
    avatar: avatars.baby,
    message: "你好啊，小狐狸。",
    type: "child",
  },
  {
    id: 1,
    avatar: avatars.fox,
    message:
      "你好啊小朋友。一起来看电视机吧！对了，点击电视里的角色会有惊喜哦！",
    type: "bot",
  },
];

// chatGpt Require
let question = "",
  parent_id = "",
  system_message = storyBac;

// video list
// bunding is used to find the fox and bear in video
const videoList = [
  {
    id: 0,
    name: "1_1",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 1,
    name: "1_2",
    isLoop: false,
    bounding: {
      fox: {
        from: [250, 375],
        to: [430, 645],
      },
      bear: {
        from: [560, 390],
        to: [720, 620],
      },
    },
  },
  {
    id: 2,
    name: "1_3_loop",
    isLoop: true,
    bounding: {
      fox: {
        from: [250, 375],
        to: [430, 645],
      },
      bear: {
        from: [560, 390],
        to: [720, 620],
      },
    },
    question: "小朋友你想和小狐狸一起去探险吗？",
    answer: "想。",
  },
  {
    id: 3,
    name: "1_4",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 4,
    name: "2_1",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 5,
    name: "2_2_loop",
    isLoop: true,
    bounding: {
      fox: {
        from: [350, 340],
        to: [495, 384],
      },
      bear: {
        from: [150, 380],
        to: [305, 630],
      },
    },
    question: "你觉得花园美吗",
    answer: "美。",
  },
  {
    id: 6,
    name: "2_3",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 7,
    name: "3_1",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 8,
    name: "3_2",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 9,
    name: "3_3",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
  {
    id: 10,
    name: "3_4",
    isLoop: false,
    bounding: {
      fox: {
        from: [0, 0],
        to: [0, 0],
      },
      bear: {
        from: [0, 0],
        to: [0, 0],
      },
    },
  },
];

export default function Video() {
  // redux
  const dispatch = useDispatch();
  const videoIndex = useSelector((state: RootState) => state.voiceIndex);
  // nav
  const nav = useNavigate();
  const videoRef = useRef<any>({});
  const [currentVideo, setCurrentVideo] = useState(0);
  let videoDom: any;
  useEffect(() => {
    if (videoIndex.value !== currentVideo) {
      setCurrentVideo(videoIndex.value);
      return;
    }
    videoDom = videoRef.current[currentVideo] as any;
    // show currentVideoDom
    videoDom.style.zIndex = 998;
    videoDom?.addEventListener("ended", () => {
      console.log("video play done");
      // load next video when currentVideo is not last video and currentVideo is not loop video
      if (currentVideo >= 10) return;
      if (videoList[currentVideo].isLoop) return;
      setCurrentVideo(currentVideo + 1);
      dispatch(increment());
    });
  });
  // play video when change videoSrc
  useEffect(() => {
    if (currentVideo === 0) {
      return;
    }
    console.log("video change");
    console.log(currentVideo);
    // auto play and repeat
    if (videoList[currentVideo].isLoop) {
      videoDom.loop = true;
      system_message =
        "你现在负责向小朋友提问题。接下来用户会给一个问题和答案，你的任务是提出用户给出的这个问题并且判断接下来的用户的回答是否和答案意思近似。如果相似则你回复“答对啦”，并附带上{next}这段字符；如果不相同则回复“小朋友再想想哦”，然后以同样的规则等待下一次回答。";
      question =
        "问题：“" +
        videoList[currentVideo].question +
        "”，答案：“" +
        videoList[currentVideo].answer +
        "”";
      answerQuestion();
    } else {
      system_message = storyBac;
    }
    // play video when loaded
    videoDom?.play();
  }, [currentVideo]);
  function onMouseMove(e: any) {
    // Find the coordinates of the pointer relative to the video dom
    const videoDom = videoRef.current[currentVideo] as any;
    const rect = videoDom.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    // console.log(x, y)
    // when pointer in bunding, change poninter to hand
    if (judgeBunding(x, y) === "fox" || judgeBunding(x, y) === "bear") {
      videoDom.style.cursor = "pointer";
    } else {
      videoDom.style.cursor = "default";
    }
  }
  // judge if pointer in fox or bear bunding, return fox or bear or null
  function judgeBunding(x: number, y: number) {
    if (
      x >= videoList[currentVideo].bounding.fox.from[0] &&
      x <= videoList[currentVideo].bounding.fox.to[0] &&
      y >= videoList[currentVideo].bounding.fox.from[1] &&
      y <= videoList[currentVideo].bounding.fox.to[1]
    ) {
      return "fox";
    } else if (
      x >= videoList[currentVideo].bounding.bear.from[0] &&
      x <= videoList[currentVideo].bounding.bear.to[0] &&
      y >= videoList[currentVideo].bounding.bear.from[1] &&
      y <= videoList[currentVideo].bounding.bear.to[1]
    ) {
      return "bear";
    } else {
      return null;
    }
  }
  // navigate to home page when click fox or bear
  function onClick(e: any) {
    const videoDom = videoRef.current[currentVideo] as any;
    const rect = videoDom.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    if (judgeBunding(x, y) === "fox") {
      nav("/game/home?host=xiaoxiao");
    } else if (judgeBunding(x, y) === "bear") {
      nav("/game/home?host=xiaoaoao");
    }
  }

  // record
  const [voiceClass, setVoiceClass] = useState("voice");
  const [maskCLass, setMaskCLass] = useState("mask");
  const [messages, setMessages] = useState(messageArr);
  const mask = useRef(null);
  // Sound control
  const audioRef = useRef(null);
  let audioDom: any;
  useEffect(() => {
    audioDom = audioRef.current as any;
  });
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
    console.log(data);
    setVoiceClass("voice");
    audioDom.play();
    question = data.data?.result[0];
    (mask.current as any).style.zIndex = zIndexDefine.bottomOne;
    messages.push({
      id: messages.length,
      avatar: avatars.baby,
      message: question || "...",
      type: "child",
    });
    setMessages(messages);
    // (messageBoxRef.current as any).scrollTop = (
    //   messageBoxRef.current as any
    // ) .scrollHeight;
    question && (await answerQuestion(true));
  }
  async function answerQuestion(isAnswer: boolean = false) {
    let message = "";
    // loading animation
    const timer = setInterval(() => {
      if (message === "") {
        message += ".";
        messages.push({
          id: messages.length,
          avatar: avatars.fox,
          message,
          type: "bot",
        });
        return;
      }
      message === "..." && (message = "");
      message += ".";
      messages[messages.length - 1].message = message;
      setMessages([...messages]);
      (messageBoxRef.current as any).scrollTop = (
        messageBoxRef.current as any
      ).scrollHeight;
      // console.log(messages)
    }, 500);
    const { data } = await axios({
      method: "get",
      url:
        nodeServerUrl +
        "/chat_withme" +
        "?question=" +
        question +
        "&parent_id=" +
        parent_id +
        "&system_message=" +
        system_message,
    });
    clearInterval(timer);
    // Determine if a edirect is required
    let needRedirect = {
      isNeed: false,
      to: "",
    };
    message = data.data?.text;
    if (message.includes("{redirectToAVG}")) {
      needRedirect.isNeed = true;
      needRedirect.to = "/story";
      message = message.replace("{redirectToAVG}", "");
    }
    if (message.includes("{redirectToGame}")) {
      needRedirect.isNeed = true;
      needRedirect.to = "/game";
      message = message.replace("{redirectToGame}", "");
    }
    console.log("message", message);
    if (message.includes("{next}") || message.includes("答对啦")) {
      message = message.replace("{next}", "");
      if (isAnswer) {
        setTimeout(() => {
          dispatch(increment());
          setCurrentVideo(currentVideo + 1);
        }, 3000);
      }
    }
    messages[messages.length - 1] = {
      id: 2358 + messages[messages.length - 1].id,
      message: message,
      type: "bot",
      avatar: avatars.fox,
    };
    parent_id = data.data?.id;
    // voice answer
    const voiceRes = await axios({
      method: "get",
      url: nodeServerUrl + "/text_to_audio" + "?msg=" + message,
    });
    if (voiceRes.data.msg === "ok") {
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
      ).scrollHeight;
    });
    needRedirect.isNeed &&
      (audioDom.onended = () => {
        nav(needRedirect.to);
      });
  }

  return (
    <Container
      onMouseMove={(e) => {
        onMouseMove(e);
      }}
      onClick={(e) => {
        onClick(e);
      }}
    >
      <div className="tv">
        <div className="tv__top">
          <div className="tv__antenna"></div>
          <div className="tv__antenna-base"></div>
        </div>
        <div className="tv__box">
          <div className="tv__screen">
            <div
              onClick={() => {
                videoDom.play();
                // button hide
                const playDom = document.querySelector(".play") as any;
                playDom.style.display = "none";
              }}
              className={currentVideo === 0 ? "play" : ""}
            >
              play
            </div>
            {/* video list */}
            {videoList.map((item) => (
              <video
                ref={(el) => {
                  videoRef.current[item.id] = el;
                }}
                key={item.id}
              >
                <source
                  src={nodeServerUrl + "/assets/videos/" + item.name + ".mp4"}
                  type="video/mp4"
                />
              </video>
            ))}
          </div>
        </div>
        <div className="tv__bottom">
          <div className="tv__leg"></div>
          <div className="tv__leg"></div>
        </div>
      </div>
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
        <div></div>
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
      <Avatars>
        <img src={messages[1].avatar} className="avatar" />
        <img src={messages[0].avatar} className="avatar" />
      </Avatars>
    </Container>
  );
}
