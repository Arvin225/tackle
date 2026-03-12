## 1. Project Setup

- [x] 1.1 Initialize Vite + React + TypeScript project
- [x] 1.2 Configure Tailwind CSS
- [x] 1.3 Set up project directory structure (core, store, components, pages, etc.)
- [x] 1.4 Install core dependencies (zustand, webdav, howler, music-metadata-browser)
- [x] 1.5 Configure TypeScript strict mode
- [x] 1.6 Set up ESLint and Prettier

## 2. Core: WebDAV Integration

- [x] 2.1 Implement WebDAVClient class with webdav library
- [x] 2.2 Implement connection configuration storage (URL, username/password, token)
- [x] 2.3 Implement Basic Auth authentication
- [x] 2.4 Implement Token-based authentication
- [x] 2.5 Implement directory listing (PROPFIND)
- [x] 2.6 Implement file streaming with Range requests
- [x] 2.7 Add connection validation and error handling
- [x] 2.8 Create useWebDAV hook

## 3. Core: Audio Engine

- [x] 3.1 Implement AudioEngine class with Web Audio API
- [x] 3.2 Implement native format playback (MP3/M4A/AAC/WAV/OGG) via AudioElement
- [x] 3.3 Integrate libflac.js for FLAC decoding
- [x] 3.4 Implement playback controls (play, pause, stop, previous, next)
- [x] 3.5 Implement seek functionality
- [x] 3.6 Implement volume control and mute
- [x] 3.7 Implement playback modes (sequential, shuffle, single loop, queue loop)
- [x] 3.8 Implement gapless playback with preloading
- [x] 3.9 Implement playback state machine (idle, loading, ready, playing, paused)
- [x] 3.10 Create useAudioPlayer hook

## 4. Core: Metadata Service

- [x] 4.1 Integrate music-metadata-browser for ID3/Vorbis/M4A parsing
- [x] 4.2 Implement embedded cover extraction
- [x] 4.3 Implement MusicBrainz API client for cover matching
- [x] 4.4 Implement LRCLIB API client for lyrics matching
- [x] 4.5 Implement Netease Cloud Music API client (optional, Chinese music)
- [x] 4.6 Implement LRC lyrics parser
- [x] 4.7 Implement metadata caching in IndexedDB
- [x] 4.8 Create useMetadata hook

## 5. Core: Storage Service

- [x] 5.1 Implement LocalStorage service for settings/playlists/favorites
- [x] 5.2 Implement IndexedDB wrapper for metadata cache
- [x] 5.3 Implement SyncManager for AList WebDAV sync
- [x] 5.4 Implement conflict resolution logic
- [x] 5.5 Create useSync hook

## 6. State Management

- [x] 6.1 Create usePlayerStore (current track, queue, playback state, volume)
- [x] 6.2 Create useLibraryStore (tracks, artists, albums, metadata index)
- [x] 6.3 Create useSettingsStore (theme, sync settings, preferences)
- [x] 6.4 Implement store persistence with Zustand persist middleware

## 7. UI: Design System

- [x] 7.1 Define CSS variables for colors, spacing, typography (light/dark)
- [x] 7.2 Create glassmorphism effect styles
- [x] 7.3 Define animation keyframes and timing functions
- [x] 7.4 Create base UI components (Button, Slider, Modal, Loading)
- [x] 7.5 Implement dark mode toggle

## 8. UI: Player Components

- [x] 8.1 Create Player component (main player view)
- [x] 8.2 Create MiniPlayer component (bottom bar)
- [x] 8.3 Create ProgressBar component
- [x] 8.4 Create VolumeControl component
- [x] 8.5 Create PlaybackControls component (play/pause/prev/next/mode)
- [x] 8.6 Create AlbumCover component with dynamic blur background
- [x] 8.7 Create TrackInfo component (title, artist, album)
- [x] 8.8 Create AudioQualityBadge component

## 9. UI: Library Components

- [x] 9.1 Create Library component (main view)
- [x] 9.2 Create FolderNavigator component
- [x] 9.3 Create TrackList component with virtual list
- [x] 9.4 Create TrackItem component
- [x] 9.5 Create ArtistList component
- [x] 9.6 Create AlbumList component
- [x] 9.7 Create SearchBar component

## 10. UI: Playlist Components

- [x] 10.1 Create Playlist component
- [x] 10.2 Create PlaylistItem component
- [x] 10.3 Create PlaylistEditor component (create/edit/reorder)
- [x] 10.4 Create Queue component
- [x] 10.5 Create Favorites component
- [x] 10.6 Create RecentTracks component

## 11. UI: Lyrics Component

- [x] 11.1 Create LyricsPanel component
- [x] 11.2 Implement lyrics sync display
- [x] 11.3 Create LyricLine component with highlight

## 12. UI: Settings Components

- [x] 12.1 Create Settings component (main view)
- [x] 12.2 Create WebDAVConfig component (connection settings)
- [x] 12.3 Create SyncSettings component
- [x] 12.4 Create ThemeSettings component
- [x] 12.5 Create PlaybackSettings component

## 13. Pages

- [x] 13.1 Create HomePage (welcome/quick access)
- [x] 13.2 Create LibraryPage (browse files)
- [x] 13.3 Create PlaylistPage (manage playlists)
- [x] 13.4 Create SettingsPage
- [x] 13.5 Set up React Router

## 14. Integration & Testing

- [x] 14.1 Integrate all components and stores
- [x] 14.2 Test WebDAV connection with AList
- [x] 14.3 Test audio playback for all supported formats
- [x] 14.4 Test metadata parsing and caching
- [x] 14.5 Test sync functionality
- [x] 14.6 Test dark mode and responsive design
- [x] 14.7 Test keyboard navigation and accessibility

## 15. Optimization

- [x] 15.1 Implement virtual list for large track lists
- [x] 15.2 Optimize metadata indexing performance
- [x] 15.3 Add loading skeletons and error boundaries
- [x] 15.4 Optimize bundle size (code splitting, tree shooting)

## 16. Documentation & Deployment

- [x] 16.1 Write README with setup instructions
- [x] 16.2 Write AList configuration guide
- [x] 16.3 Build production bundle
- [x] 16.4 Deploy to CDN/static hosting

## 17. Windows Client (Future)

- [x] 17.1 Set up Tauri project
- [x] 17.2 Configure native window and system tray
- [x] 17.3 Add system media control integration
- [x] 17.4 Build Windows installer
- [x] 17.5 Set up auto-update mechanism
