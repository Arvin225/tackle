import { AudioDecoder } from "./Decoder";
import { DecodeResult } from "./types";
import { FLACDecoder as FLACDecoderLib } from "@wasm-audio-decoders/flac";

/**
 * FLAC decoder using @wasm-audio-decoders/flac
 */
export class FLACDecoder implements AudioDecoder {
  private decoder: FLACDecoderLib | null = null;

  constructor() {
    this.initializeDecoder();
  }

  private async initializeDecoder(): Promise<void> {
    try {
      this.decoder = new FLACDecoderLib();
      await this.decoder.ready;
    } catch (error) {
      console.error("Failed to initialize FLAC decoder:", error);
      this.decoder = null;
    }
  }

  async canDecode(_file: ArrayBuffer, mimeType: string): Promise<boolean> {
    // Wait for decoder to be initialized
    if (!this.decoder) {
      await this.initializeDecoder();
    }

    return mimeType === "audio/flac" && this.decoder !== null;
  }

  async decode(file: ArrayBuffer, _mimeType: string): Promise<DecodeResult> {
    if (!this.decoder) {
      await this.initializeDecoder();
      if (!this.decoder) {
        return Promise.reject(new Error("FLAC decoder not initialized"));
      }
    }

    try {
      const result = await this.decoder.decode(new Uint8Array(file));

      return {
        channels: result.channelData.length,
        samples: result.samplesDecoded,
        sampleRate: result.sampleRate,
        channelData: result.channelData,
      };
    } catch (error) {
      return Promise.reject(new Error(`FLAC decoding failed: ${error}`));
    }
  }
}
