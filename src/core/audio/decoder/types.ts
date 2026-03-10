export interface DecodeResult {
  channels: number
  samples: number
  sampleRate: number
  channelData: Float32Array[]
}
