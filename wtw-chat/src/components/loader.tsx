/*
 * @Date: 2023-03-03 18:32:05
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-27 20:43:26
 * @FilePath: \wtw-front\wtw-chat\src\components\loader.tsx
 * @description:
 */
import styled from "styled-components";


let contaninerZIndex = 1

const LoadingContainer = styled.div`
  .loader-container {
    position: absolute;
    z-index: ${contaninerZIndex};
    height: 40px;
    width: 110px;
    /* margin: 10px auto 0; */
    right: calc(50% - 55px);
    top: calc(50% - 20px);
  }

  .loader-container > div {
    position: relative;
    display: inline-block;
    background: #b7dfe8;
    height: 100%;
    width: 10px;
    margin: 0;
    -webkit-animation: load 3s ease-in-out infinite;
    animation: load 3s ease-in-out infinite;
  }

  .loader-container .rectangle-2 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  .loader-container .rectangle-3 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .loader-container .rectangle-4 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  .loader-container .rectangle-5 {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .loader-container .rectangle-6 {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }

  @keyframes load {
    0%,
    100% {
      transform: scaleY(1);
      background: #f7fafa;
    }
    16.67% {
      transform: scaleY(3);
      background: #def1f5;
    }
    33.33% {
      transform: scaleY(1);
      background: #c1e4ec;
    }
    50% {
      transform: scaleY(3);
      background: #b5e2f3;
    }
    66.67% {
      transform: scaleY(1);
      background: #a9e2f0;
    }
    83.34% {
      transform: scaleY(3);
      background: #9de6f7;
    }
  }
`;

export default function Loader() {
  return (
    <LoadingContainer>
      <div className="loader-container">
        <div className="rectangle-1"></div>
        <div className="rectangle-2"></div>
        <div className="rectangle-3"></div>
        <div className="rectangle-4"></div>
        <div className="rectangle-5"></div>
        <div className="rectangle-6"></div>
        <div className="rectangle-5"></div>
        <div className="rectangle-4"></div>
        <div className="rectangle-3"></div>
        <div className="rectangle-2"></div>
        <div className="rectangle-1"></div>
      </div>
    </LoadingContainer>
  );
}
