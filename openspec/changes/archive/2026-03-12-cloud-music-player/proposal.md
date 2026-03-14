## Why

网盘用户需要在云端存储的音乐文件可以直接播放，而无需下载到本地。现有的网盘自带播放器功能简陋，缺乏专业的音乐播放体验（如歌词、封面、无损音质支持等）。用户希望有一款苹果风格的音乐播放器，能够接入夸克网盘、阿里云盘等主流网盘，提供流畅、美观的播放体验。

## What Changes

- **新增** 基于 Web 的云音乐播放器，支持 Windows 和 Web 双端
- **新增** WebDAV 协议接入，通过 AList 连接夸克网盘、阿里云盘等网盘
- **新增** 多格式音频播放支持：MP3、M4A、AAC、WAV、OGG、FLAC
- **新增** ID3 标签解析，自动读取音乐元数据
- **新增** 在线封面匹配（MusicBrainz、网易云音乐）
- **新增** 在线歌词匹配（LRCLIB、网易云音乐）
- **新增** 播放列表管理
- **新增** 数据同步（本地存储 + AList WebDAV）
- **新增** 苹果风格 UI 设计（毛玻璃效果、流畅动画、暗色模式）

## Capabilities

### New Capabilities

- `webdav-integration`: WebDAV 协议集成，连接 AList 服务，支持目录浏览、文件流式访问、认证管理
- `audio-playback`: 音频播放引擎，支持多格式解码（MP3/M4A/FLAC 等）、播放控制、进度管理、播放模式
- `metadata-management`: 元数据管理，包括 ID3 标签解析、在线封面匹配、在线歌词匹配、元数据索引
- `playlist-management`: 播放列表管理，包括创建、编辑、删除播放列表，添加、移除、排序歌曲
- `data-sync`: 数据同步，支持本地存储（localStorage + IndexedDB）和 AList WebDAV 云端同步
- `apple-ui`: 苹果风格 UI，包括毛玻璃效果、动画系统、暗色模式、响应式设计

### Modified Capabilities

<!-- 无现有能力修改 -->

## Impact

### 技术栈
- 前端：React 18 + TypeScript + Vite
- UI：Tailwind CSS + 自定义苹果风格组件
- 状态管理：Zustand
- 音频引擎：Howler.js + Web Audio API + libflac.js (WASM)
- WebDAV：webdav npm 包
- 元数据：music-metadata-browser
- 存储：localStorage + IndexedDB
- 后续打包：Tauri (Windows 客户端)

### 外部依赖
- AList 服务（用户自部署）
- MusicBrainz API（封面匹配）
- LRCLIB API（歌词匹配）
- 网易云音乐非官方 API（中文歌曲封面/歌词）

### 用户体验影响
- 首次使用需要配置 AList 连接
- 支持账号密码和 Token 两种认证方式
- 大型音乐库使用虚拟列表优化性能
- 仅缓存元数据，不缓存音频文件（节省存储空间）
