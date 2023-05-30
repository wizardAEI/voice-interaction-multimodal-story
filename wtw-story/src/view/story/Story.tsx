/*
 * @Date: 2023-04-30 11:44:51
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-01 13:33:20
 * @FilePath: \wtw-front\wtw-story\src\view\story\Story.tsx
 * @description: 
 */
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { nodeServerUrl } from "../../../../pkg/config/url";
import storys from "../../assets/story.json";
import { useEffect, useRef, useState } from "react";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-image: url(${nodeServerUrl + "/assets/story/bac/forest.png"});
  background-size: cover;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow-y: scroll;
  img {
    display: block;
    width: 736px;
    height: 500px;
    margin: 50px 0;
    border-radius: 10px;
    animation: fadein 1s;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default function Story() {

  // Scroll control
  const boxRef = useRef(null);

  // Sound control
  const audioRef = useRef(null);
  let audioDom: any;
  useEffect(() => {
    audioDom = audioRef.current as any;
  });
  // story imgs
  const [imgs, setImgs] = useState<{
    src: string;
    id: number;
  }[]>([]);
  const { id } = useParams();
  // load storys
  function loadStory(index: number) {
    const nowIndex = parseInt(id!) - 1;
    if(index >= storys[nowIndex].length) {
        return
    }
    const storyType = storys[nowIndex].type[index];
    audioDom.onended = () => {
        console.log("end")
        loadStory(index + 1);
    }
    if (storyType === "w") {
      audioDom.src =
        nodeServerUrl +
        "/assets/story/info/" +
        storys[nowIndex].name +
        "_" +
        index +
        ".wav";
      audioDom.onerror = () => {
        alert("音频加载失败，请检查网络连接！")
        };
      audioDom.play();
      if(storys[nowIndex].type[index + 1] === 'p') {
        loadStory(index + 1)
      }
    } else {
      imgs.push({
        src: nodeServerUrl +
        "/assets/story/info/" +
        storys[nowIndex].name +
        "_" +
        index +
        ".png",
        id: index
      })
      console.log(imgs)
      setImgs([...imgs]);
      setTimeout(() => {
      (boxRef.current as any).scrollTop = (
        boxRef.current as any
      ) .scrollHeight;
      }, 100);
      if(storys[nowIndex].type[index + 1] === 'p') {
        setTimeout(() => {
            loadStory(index + 1);
        }, 3000);
      }
    }
  }
  useEffect(() => {
    loadStory(0);
  }, []);
  return (
    <Container ref={boxRef}>
      <audio ref={audioRef}></audio>
      {imgs.map((img, index) => {
        return <img src={img.src} alt="" key={img.id} />;
      })}
    </Container>
  );
}
