import { DecodeResult } from './types'

export interface AudioDecoder {
  canDecode(file: ArrayBuffer, mimeType: string): Promise<boolean>
  decode(file: ArrayBuffer, mimeType: string): Promise<DecodeResult>
}

export interface DecoderFactory {
  createDecoder(mimeType: string): AudioDecoder | null
  getSupportedMimeTypes(): string[]
}
