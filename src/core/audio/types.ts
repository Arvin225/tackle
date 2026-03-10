export enum AudioFormat {
  MP3 = 'mp3',
  M4A = 'm4a',
  AAC = 'aac',
  FLAC = 'flac',
  WAV = 'wav',
  OGG = 'ogg',
}

export interface Track {
  id: string
  url: string
  title?: string
  artist?: string
  album?: string
  duration?: number
  format?: AudioFormat
}

export interface AudioEngineConfig {
  gaplessPlayback?: boolean
  crossfadeDuration?: number
  preloadAheadPercent?: number
}

export enum PlaybackState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
}

export enum PlaybackMode {
  SEQUENTIAL = 'SEQUENTIAL',
  SHUFFLE = 'SHUFFLE',
  SINGLE_LOOP = 'SINGLE_LOOP',
  QUEUE_LOOP = 'QUEUE_LOOP',
}
