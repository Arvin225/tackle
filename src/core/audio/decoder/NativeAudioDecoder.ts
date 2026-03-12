import { AudioDecoder } from "./Decoder";
import { DecodeResult } from "./types";

/**
 * Base decoder with common functionality
 */
export class BaseDecoder implements AudioDecoder {
  canDecode(_file: ArrayBuffer, _mimeType: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  decode(_file: ArrayBuffer, _mimeType: string): Promise<DecodeResult> {
    return Promise.reject(new Error("Base decoder cannot decode"));
  }
}

export class NativeAudioDecoder extends BaseDecoder {
  constructor() {
    super();
  }

  canDecode(file: ArrayBuffer, mimeType: string): Promise<boolean> {
    // Check if browser supports this format natively
    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([file], { type: mimeType }));
    const supported = audio.canPlayType(mimeType) !== "";
    URL.revokeObjectURL(audio.src);
    return Promise.resolve(supported);
  }

  decode(file: ArrayBuffer, mimeType: string): Promise<DecodeResult> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(new Blob([file], { type: mimeType }));
      audio.src = url;

      audio.onloadedmetadata = async () => {
        URL.revokeObjectURL(url);

        // For native decoding, we'll return a simplified result
        // since we can't easily extract PCM data from MediaElement
        const channelCount = 2; // Assume stereo
        const sampleRate = 44100; // Assume CD quality
        const duration = audio.duration;
        const samples = Math.floor(duration * sampleRate);

        // Create placeholder channel data
        const channelData: Float32Array[] = [];
        for (let i = 0; i < channelCount; i++) {
          channelData.push(new Float32Array(samples));
        }

        resolve({
          channels: channelCount,
          samples: samples,
          sampleRate,
          channelData,
        });
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to decode audio"));
      };
    });
  }
}
