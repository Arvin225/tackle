# Cloud Music Player

A beautiful, Apple-inspired cloud music player that supports WebDAV connectivity. Built with React, TypeScript, and modern web technologies.

## Features

- 🎵 **Multi-format Audio Playback**: Support for MP3, M4A, AAC, FLAC, WAV, and OGG formats
- ☁️ **WebDAV Integration**: Connect to your cloud storage via AList or any WebDAV-compatible service
- 🎨 **Apple Design**: Glassmorphism effects, smooth animations, and dark mode
- 📚 **Music Library**: Browse files, artists, and albums
- 🎧 **Playlist Management**: Create, edit, and manage playlists
- 🔄 **Sync Options**: Sync your playlists and favorites with cloud storage
- 🎤 **Lyrics Support**: Display synchronized lyrics (coming soon)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Custom Components
- **State Management**: Zustand
- **Audio Engine**: Howler.js + Web Audio API + libflac.js (WASM)
- **WebDAV**: webdav npm package
- **Metadata**: music-metadata-browser
- **Storage**: localStorage + IndexedDB

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A WebDAV-compatible server (e.g., AList)
- For development: AList server running locally

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cloud-music-player
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup WebDAV Connection

1. Start your AList server
2. Configure the WebDAV URL in the app:
   - Navigate to Settings → General → WebDAV Connection
   - Enter your server URL, username, and password (optional)

### 4. Add Music Files

- Import or add music files to your WebDAV server
- The player will automatically scan for audio files

### 5. Start Playing

- Browse your library in the Library tab
- Select a track to start playing
- Use the player controls to navigate and control playback

## Development

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory.

## Configuration

### WebDAV Connection

Configure your WebDAV server in the app:

- **Server URL**: Full URL to WebDAV server (e.g., `https://your-server.com/remote.php/webdav/`)
- **Username**: Your WebDAV username (optional)
- **Password**: Your WebDAV password (optional)
- **Token**: Alternative authentication method (optional)

### Audio Quality

The player supports multiple audio formats:

- **Lossless**: FLAC, WAV
- **Compressed**: MP3, M4A, AAC, OGG

For best quality, use lossless formats.

## Features Guide

### Playing Music

1. Navigate to the Library tab
2. Browse folders and select a music file
3. Click play to start audio playback

### Managing Playlists

1. Go to the Playlists tab
2. Click the + button to create a new playlist
3. Select tracks from your library
4. Save your playlist

### Syncing Data

1. Go to Settings → Sync
2. Enable "Sync on Startup" for automatic synchronization
3. Manually click "Sync Now" to sync immediately

### Theme Settings

1. Go to Settings → Appearance
2. Choose between Light, Dark, or System theme
3. The theme preference is saved automatically

## Troubleshooting

### Connection Issues

If you can't connect to WebDAV:

1. Verify your AList server is running
2. Check the WebDAV URL is correct
3. Ensure CORS is enabled on your server
4. Try using a token instead of username/password

### Audio Not Playing

If audio doesn't play:

1. Check the file format is supported
2. Verify the file URL is accessible
3. Check browser console for errors
4. Try a different browser

## Future Enhancements

- [ ] Windows Desktop Client (Tauri)
- [ ] Offline Mode
- [ ] Smart Playlists
- [ ] Advanced Audio Effects
- [ ] Bluetooth Support
- [ ] More Online APIs (Spotify, Apple Music)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

Built with ❤️ using React and Web Technologies
