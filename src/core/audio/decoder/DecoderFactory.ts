import { AudioDecoder, DecoderFactory } from './Decoder'
import { NativeAudioDecoder } from './NativeAudioDecoder'
import { FLACDecoder } from './FLACDecoder'

export class DecoderFactoryImpl implements DecoderFactory {
  private decoders: AudioDecoder[] = []
  private mimeTypeMap: Map<string, AudioDecoder> = new Map()

  constructor() {
    // Initialize decoders
    this.decoders.push(new NativeAudioDecoder())
    this.decoders.push(new FLACDecoder())

    // Register MIME types
    this.registerMimeTypes()
  }

  private registerMimeTypes(): void {
    const mimeTypes = [
      { type: 'audio/mpeg', decoder: this.decoders[0] }, // MP3
      { type: 'audio/mp4', decoder: this.decoders[0] }, // M4A
      { type: 'audio/aac', decoder: this.decoders[0] }, // AAC
      { type: 'audio/wav', decoder: this.decoders[0] }, // WAV
      { type: 'audio/ogg', decoder: this.decoders[0] }, // OGG
    ]

    mimeTypes.forEach(({ type, decoder }) => {
      this.mimeTypeMap.set(type, decoder)
    })
  }

  getSupportedMimeTypes(): string[] {
    return Array.from(this.mimeTypeMap.keys())
  }

  createDecoder(mimeType: string): AudioDecoder | null {
    return this.mimeTypeMap.get(mimeType) || null
  }
}
