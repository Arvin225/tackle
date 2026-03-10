## 1. Project Setup

- [ ] 1.1 Initialize Vite + React + TypeScript project
- [ ] 1.2 Configure Tailwind CSS
- [ ] 1.3 Set up project directory structure (core, store, components, pages, etc.)
- [ ] 1.4 Install core dependencies (zustand, webdav, howler, music-metadata-browser)
- [ ] 1.5 Configure TypeScript strict mode
- [ ] 1.6 Set up ESLint and Prettier

## 2. Core: WebDAV Integration

- [ ] 2.1 Implement WebDAVClient class with webdav library
- [ ] 2.2 Implement connection configuration storage (URL, username/password, token)
- [ ] 2.3 Implement Basic Auth authentication
- [ ] 2.4 Implement Token-based authentication
- [ ] 2.5 Implement directory listing (PROPFIND)
- [ ] 2.6 Implement file streaming with Range requests
- [ ] 2.7 Add connection validation and error handling
- [ ] 2.8 Create useWebDAV hook

## 3. Core: Audio Engine

- [ ] 3.1 Implement AudioEngine class with Web Audio API
- [ ] 3.2 Implement native format playback (MP3/M4A/AAC/WAV/OGG) via AudioElement
- [ ] 3.3 Integrate libflac.js for FLAC decoding
- [ ] 3.4 Implement playback controls (play, pause, stop, previous, next)
- [ ] 3.5 Implement seek functionality
- [ ] 3.6 Implement volume control and mute
- [ ] 3.7 Implement playback modes (sequential, shuffle, single loop, queue loop)
- [ ] 3.8 Implement gapless playback with preloading
- [ ] 3.9 Implement playback state machine (idle, loading, ready, playing, paused)
- [ ] 3.10 Create useAudioPlayer hook

## 4. Core: Metadata Service

- [ ] 4.1 Integrate music-metadata-browser for ID3/Vorbis/M4A parsing
- [ ] 4.2 Implement embedded cover extraction
- [ ] 4.3 Implement MusicBrainz API client for cover matching
- [ ] 4.4 Implement LRCLIB API client for lyrics matching
- [ ] 4.5 Implement Netease Cloud Music API client (optional, Chinese music)
- [ ] 4.6 Implement LRC lyrics parser
- [ ] 4.7 Implement metadata caching in IndexedDB
- [ ] 4.8 Create useMetadata hook

## 5. Core: Storage Service

- [ ] 5.1 Implement LocalStorage service for settings/playlists/favorites
- [ ] 5.2 Implement IndexedDB wrapper for metadata cache
- [ ] 5.3 Implement SyncManager for AList WebDAV sync
- [ ] 5.4 Implement conflict resolution logic
- [ ] 5.5 Create useSync hook

## 6. State Management

- [ ] 6.1 Create usePlayerStore (current track, queue, playback state, volume)
- [ ] 6.2 Create useLibraryStore (tracks, artists, albums, metadata index)
- [ ] 6.3 Create useSettingsStore (theme, sync settings, preferences)
- [ ] 6.4 Implement store persistence with Zustand persist middleware

## 7. UI: Design System

- [ ] 7.1 Define CSS variables for colors, spacing, typography (light/dark)
- [ ] 7.2 Create glassmorphism effect styles
- [ ] 7.3 Define animation keyframes and timing functions
- [ ] 7.4 Create base UI components (Button, Slider, Modal, Loading)
- [ ] 7.5 Implement dark mode toggle

## 8. UI: Player Components

- [ ] 8.1 Create Player component (main player view)
- [ ] 8.2 Create MiniPlayer component (bottom bar)
- [ ] 8.3 Create ProgressBar component
- [ ] 8.4 Create VolumeControl component
- [ ] 8.5 Create PlaybackControls component (play/pause/prev/next/mode)
- [ ] 8.6 Create AlbumCover component with dynamic blur background
- [ ] 8.7 Create TrackInfo component (title, artist, album)
- [ ] 8.8 Create AudioQualityBadge component

## 9. UI: Library Components

- [ ] 9.1 Create Library component (main view)
- [ ] 9.2 Create FolderNavigator component
- [ ] 9.3 Create TrackList component with virtual list
- [ ] 9.4 Create TrackItem component
- [ ] 9.5 Create ArtistList component
- [ ] 9.6 Create AlbumList component
- [ ] 9.7 Create SearchBar component

## 10. UI: Playlist Components

- [ ] 10.1 Create Playlist component
- [ ] 10.2 Create PlaylistItem component
- [ ] 10.3 Create PlaylistEditor component (create/edit/reorder)
- [ ] 10.4 Create Queue component
- [ ] 10.5 Create Favorites component
- [ ] 10.6 Create RecentTracks component

## 11. UI: Lyrics Component

- [ ] 11.1 Create LyricsPanel component
- [ ] 11.2 Implement lyrics sync display
- [ ] 11.3 Create LyricLine component with highlight

## 12. UI: Settings Components

- [ ] 12.1 Create Settings component (main view)
- [ ] 12.2 Create WebDAVConfig component (connection settings)
- [ ] 12.3 Create SyncSettings component
- [ ] 12.4 Create ThemeSettings component
- [ ] 12.5 Create PlaybackSettings component

## 13. Pages

- [ ] 13.1 Create HomePage (welcome/quick access)
- [ ] 13.2 Create LibraryPage (browse files)
- [ ] 13.3 Create PlaylistPage (manage playlists)
- [ ] 13.4 Create SettingsPage
- [ ] 13.5 Set up React Router

## 14. Integration & Testing

- [ ] 14.1 Integrate all components and stores
- [ ] 14.2 Test WebDAV connection with AList
- [ ] 14.3 Test audio playback for all supported formats
- [ ] 14.4 Test metadata parsing and caching
- [ ] 14.5 Test sync functionality
- [ ] 14.6 Test dark mode and responsive design
- [ ] 14.7 Test keyboard navigation and accessibility

## 15. Optimization

- [ ] 15.1 Implement virtual list for large track lists
- [ ] 15.2 Optimize metadata indexing performance
- [ ] 15.3 Add loading skeletons and error boundaries
- [ ] 15.4 Optimize bundle size (code splitting, tree shaking)

## 16. Documentation & Deployment

- [ ] 16.1 Write README with setup instructions
- [ ] 16.2 Write AList configuration guide
- [ ] 16.3 Build production bundle
- [ ] 16.4 Deploy to CDN/static hosting

## 17. Windows Client (Future)

- [ ] 17.1 Set up Tauri project
- [ ] 17.2 Configure native window and system tray
- [ ] 17.3 Add system media control integration
- [ ] 17.4 Build Windows installer
- [ ] 17.5 Set up auto-update mechanism
