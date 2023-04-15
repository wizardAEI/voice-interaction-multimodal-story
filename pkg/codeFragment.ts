import { nodeServerUrl } from "./config/url";
import axios from "axios";

// 解析音频成文本请求
export async function parseAudio(formData: FormData) {
    const res = await axios({
        method: "post",
        url: nodeServerUrl + "/parse_audio",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(res.data.data?.result) {
        const results = res.data.data.result as string[]
        return results[0]
      }
}