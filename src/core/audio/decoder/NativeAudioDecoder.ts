import { AudioDecoder } from './Decoder'

/**
 * Base decoder with common functionality
 */
export class BaseDecoder implements AudioDecoder {
  canDecode(_file: ArrayBuffer, _mimeType: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  decode(_file: ArrayBuffer, _mimeType: string): Promise<DecodeResult> {
    return Promise.reject(new Error('Base decoder cannot decode'))
  }
}

export class NativeAudioDecoder extends BaseDecoder {
  constructor() {
    super()
  }

  canDecode(file: ArrayBuffer, mimeType: string): Promise<boolean> {
    // Check if browser supports this format natively
    const audio = new Audio()
    audio.src = URL.createObjectURL(new Blob([file], { type: mimeType }))
    const supported = audio.canPlayType(mimeType) !== ''
    URL.revokeObjectURL(audio.src)
    return Promise.resolve(supported)
  }

  decode(file: ArrayBuffer, mimeType: string): Promise<DecodeResult> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(new Blob([file], { type: mimeType }))
      audio.src = url

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url)

        const channelCount = audio.mozAudioChannelCount || 2
        const sampleRate = audio.sampleRate
        const duration = audio.duration
        const channelData = new Float32Array(duration * sampleRate * channelCount)

        // Create offline audio context to get PCM data
        const offlineContext = new OfflineAudioContext(
          channelCount,
          duration * sampleRate,
          sampleRate
        )

        const source = offlineContext.createMediaElementSource(audio)
        source.connect(offlineContext.destination)

        const renderedBuffer = offlineContext.startRendering()

        renderedBuffer.then((buffer) => {
          resolve({
            channels: buffer.numberOfChannels,
            samples: buffer.length,
            sampleRate,
            channelData: [buffer.getChannelData(0)],
          })
        })
      }

      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to decode audio'))
      }
    })
  }
}
