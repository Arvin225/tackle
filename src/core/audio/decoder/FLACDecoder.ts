import { AudioDecoder } from './Decoder'

/**
 * Placeholder FLAC decoder using libflac.js
 * TODO: Implement when libflac.js is loaded
 */
export class FLACDecoder implements AudioDecoder {
  canDecode(_file: ArrayBuffer, _mimeType: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  decode(_file: ArrayBuffer, _mimeType: string): Promise<DecodeResult> {
    return Promise.reject(
      new Error('FLAC decoder not implemented. Please load libflac.js')
    )
  }
}
