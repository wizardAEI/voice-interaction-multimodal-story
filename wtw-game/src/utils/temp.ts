/*
 * @Date: 2023-01-16 14:29:40
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-19 23:36:19
 * @FilePath: \wtw-front\wtw-chat\src\utils\temp.ts
 * @description: 
 */
import axios from "axios";
import { nodeServerUrl } from "../../../pkg/config/url";
let mediaRecorder: MediaRecorder;
let chunks: BlobPart[] | undefined = [];

if (navigator.mediaDevices.getUserMedia) {
  const constraints = { audio: {
      sampleRate: 16000, // 采样率
      channelCount: 1,   // 声道
  } };
  navigator.mediaDevices.getUserMedia(constraints).then(
    (stream) => {
      console.log("授权成功！");
      mediaRecorder = new MediaRecorder(stream);
      
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}
export function recordStart() {
  console.log("录音中...");
  if (mediaRecorder.state === "recording") {
    return;
  }
  mediaRecorder.start();
  mediaRecorder.ondataavailable = function (e) {
    chunks && chunks.push(e.data);
  };
  console.log("录音中...");
}
export async function recordStop() {
  return new Promise((resolve, rej) => {
    console.log("录音结束");
    if (mediaRecorder.state === "inactive") {
      return;
    }
    mediaRecorder.stop();
    mediaRecorder.onstop = async (e) => {
      let blob = new Blob(chunks, { 'type': "audio/wav; codecs=opus" });
      let audioURL = window.URL.createObjectURL(blob);
      const audio = document.querySelector(
        ".audio-player1"
      ) as HTMLAudioElement;
      audio.src = audioURL;
      // let formData = new FormData();
      // formData.append("type", "20");
      // formData.append("file", blob, "file.wav");
      // console.log(formData)
      chunks = [];
      let formData = new FormData();
      formData.append("file", blob, "file.wav");

      const res = await axios({
        method: "post",
        url: nodeServerUrl + "/parse_audio",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.msg === "ok") {
        resolve(JSON.parse(res.data.data))
      }
			rej('解析失败')
    };
  });
}
