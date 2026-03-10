export interface WebDAVConfig {
  serverUrl: string
  username?: string
  password?: string
  token?: string
}

export interface DirectoryListingItem {
  type: 'file' | 'directory'
  name: string
  size?: number
  lastModified?: Date
  mime?: string
  url: string
  path: string
}

export interface WebDAVConnectionState {
  connected: boolean
  config?: WebDAVConfig
  error?: string
}
