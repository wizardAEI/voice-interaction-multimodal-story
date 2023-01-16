/*
 * @Date: 2023-01-15 19:58:35
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 17:24:55
 * @FilePath: \wtw-front\wtw-threejs\src\utils\record.ts
 * @description: 
 */
/*
 * @Date: 2023-01-15 19:58:35
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 13:58:51
 * @FilePath: \wtw-front\wtw-threejs\src\utils\record.ts
 * @description: 
 */
let context: AudioContext
let stream: MediaStream
let recorder: ScriptProcessorNode
const config = {
  channelCount: 1,
  sampleBits: 16,
  numberOfInputChannels: 16,
  sampleRate: 16000,
  bufferSize: 4096
}
let audioInput: MediaStreamAudioSourceNode //将声音输入这个对像


let audioData = {
  size: 0,        //录音文件长度
  buffer: [],     //录音缓存  
  inputSampleRate: config.sampleRate,    //输入采样率
  inputSampleBits: 16, //输入采样数位 8, 16 
  outputSampleRate: config.sampleRate,    //输出采样率
  oututSampleBits: config.sampleBits,    //输出采样数位 8, 16
  input: function(data: any) { // 实时存储录音的数据
    // @ts-ignore
    this.buffer.push(new Float32Array(data))  //Float32Array
    this.size += data.length
  },
  getRawData: function() { //合并压缩  
    //合并
    let data = new Float32Array(this.size)
    let offset = 0
    for(let i = 0; i < this.buffer.length; i++) {
      data.set(this.buffer[i], offset)
      // @ts-ignore
      offset += this.buffer[i].length
    }
    // 压缩
    let getRawDataion = Math.floor(this.inputSampleRate / this.outputSampleRate)
    let length = data.length / getRawDataion
    let result = new Float32Array(length)
    let index = 0, j = 0
    while (index < length) {  
      result[index] = data[j]
      j += getRawDataion
      index++
    }
    return result
  },
  closeContext: function(){ //关闭AudioContext否则录音多次会报错
    context.close() 
  },
  getPcmBuffer: function() { // pcm buffer 数据
    let bytes = this.getRawData(),
    offset = 0,
    sampleBits = this.oututSampleBits,
    dataLength = bytes.length * (sampleBits / 8),
    buffer = new ArrayBuffer(dataLength),
    data = new DataView(buffer);
    for (var i = 0; i < bytes.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, bytes[i]));
      // 16位直接乘就行了
      data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([data])
  }
}

if (navigator.mediaDevices.getUserMedia) {
  const constraints = { audio: {
      sampleRate: config.sampleRate, // 采样率
      channelCount: config.channelCount,   // 声道
  } };
  navigator.mediaDevices.getUserMedia(constraints).then(
    (s) => {
      stream = s
      console.log("授权成功！");
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}



export const start = () => {
  console.log(context)
  if(context) {
    audioData.closeContext()
    audioData.buffer = []
    audioData.size = 0
  }
  context = new AudioContext()
  audioInput = context.createMediaStreamSource(stream)
  let volume = context.createGain() //设置音量节点
  audioInput.connect(volume)
  recorder = context.createScriptProcessor(config.bufferSize, config.channelCount, config.channelCount)
  audioData.inputSampleRate = context.sampleRate
  audioInput.connect(recorder)
  recorder.connect(context.destination)
  // 音频采集
  recorder.onaudioprocess = (e) => {
    audioData.input(e.inputBuffer.getChannelData(0))
  }
}

export const stop = () => {
  recorder.disconnect()
  return audioData.getPcmBuffer()
}

