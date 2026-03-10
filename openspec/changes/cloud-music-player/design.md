## Context

### 背景

云音乐播放器是一个 Web 应用，通过 AList + WebDAV 协议连接用户的网盘（夸克、阿里云盘等），提供专业的音乐播放体验。项目采用快速验证策略，先开发 Web 端，后续通过 Tauri 打包 Windows 客户端。

### 技术约束

- **网盘无官方 API**：夸克、阿里云盘等无公开 API，通过 AList 作为中间层
- **浏览器音频限制**：浏览器原生不支持 FLAC 解码，需使用 WASM
- **流式播放挑战**：大文件需 Range 请求，FLAC 的 VBR 特性使 Seek 复杂
- **跨域问题**：AList 需配置 CORS，否则跨域请求失败

### 用户场景

1. 用户自部署 AList 并连接网盘
2. 配置播放器连接 AList（账号密码或 Token）
3. 浏览网盘中的音乐文件夹
4. 播放音乐，查看歌词、封面
5. 创建播放列表，同步到 AList

## Goals / Non-Goals

**Goals:**

- 实现稳定的多格式音频播放（MP3/M4A/FLAC/WAV/OGG）
- 提供流畅的用户体验（苹果风格 UI、流畅动画）
- 支持大型音乐库（虚拟列表、元数据索引）
- 实现数据同步（本地 + AList WebDAV）
- 支持在线元数据匹配（封面、歌词）

**Non-Goals:**

- 暂不支持 DSD/APE 格式（后续迭代）
- 不支持音频文件离线缓存
- 不支持在线音乐流媒体（仅网盘文件）
- 不支持音频编辑/转换
- 不支持多用户/社交功能

## Decisions

### 1. 网盘接入方案

**决定：AList + WebDAV**

**理由：**
- AList 已支持夸克、阿里云盘等主流网盘，无需重复开发驱动
- WebDAV 是标准协议，成熟稳定
- 用户自部署，数据安全可控
- 快速验证，降低开发风险

**替代方案：**
- 直接逆向网盘 API：开发周期长，API 变更风险高
- 其他网盘管理工具：生态不如 AList 成熟

### 2. 音频解码方案

**决定：混合方案**

| 格式 | 解码方式 | 理由 |
|------|---------|------|
| MP3/M4A/AAC/WAV/OGG | 浏览器原生 AudioElement | 性能最优，兼容性好 |
| FLAC | libflac.js (WASM) | 浏览器不支持，WASM 性能可接受 |
| DSD/APE | 暂不支持 | 优先级低，后续迭代 |

**替代方案：**
- 全部使用 WASM 解码：性能开销大，没有必要
- 使用 ffmpeg.wasm：体积过大（~30MB），不适合 Web

### 3. 状态管理方案

**决定：Zustand**

**理由：**
- 轻量（~3KB），API 简洁
- 内置持久化支持
- TypeScript 支持好
- 无需 Provider 包裹

**替代方案：**
- Redux Toolkit：较重，适合大型项目
- Jotai/Recoil：原子化状态管理，学习成本较高

### 4. UI 框架方案

**决定：Tailwind CSS + 自定义组件**

**理由：**
- 最大灵活性，可精确复刻苹果设计
- 性能最优（CSS-in-JS 无运行时开销）
- 暗色模式支持简单
- 毛玻璃效果实现简单

**替代方案：**
- Framework7：iOS 风格现成，但定制性差
- Shadcn/ui：组件现成，但苹果风格需大量调整

### 5. 流式播放方案

**决定：HTTP Range Request + 缓冲区管理**

**理由：**
- 避免下载整个文件
- 支持 Seek 操作
- 节省带宽

**实现细节：**
- 初始缓冲：2-5MB 或 10-30 秒音频
- 流式缓冲：保持 30 秒 - 2 分钟缓冲
- Seek：丢弃旧缓冲，从新位置重新请求
- Gapless：当前曲目播放 80% 时预加载下一首

**FLAC Seek 挑战：**
- FLAC 是 VBR，无法精确计算 时间 → 字节偏移
- 方案 A（推荐）：解析内嵌 CUESHEET 或生成 seek table
- 方案 B：使用平均码率估算，seek 后重新同步

### 6. 元数据索引方案

**决定：IndexedDB + 增量更新**

**理由：**
- 支持大量数据存储
- 支持索引，搜索高效
- 增量更新，启动快速

**数据结构：**
```
tracks (主表)
├─ id: string (file path hash)
├─ path, title, artist, album
├─ duration, coverUrl
├─ lastModified
└─ webdavSource

索引：
├─ byArtist: artist
├─ byAlbum: album
├─ byTitle: title
└─ byLastModified: lastModified
```

### 7. 同步方案

**决定：双向同步（本地优先）**

**理由：**
- 本地存储响应快
- AList 作为云端备份
- 冲突时提示用户选择

**同步数据：**
- 播放列表 (`playlists.json`)
- 收藏歌曲 (`favorites.json`)
- 播放进度 (`playback-state.json`)
- 设置偏好 (`settings.json`)

**同步流程：**
1. 启动时从 AList 拉取最新数据
2. 本地优先读取
3. 变更时后台同步到 AList
4. 冲突时提示用户

## Risks / Trade-offs

### Risk 1: WASM 解码性能

**风险**：大文件 FLAC 解码可能卡顿，影响用户体验

**缓解措施**：
- 显示加载进度
- 支持取消加载
- 提供降级方案（提示用户转码）

### Risk 2: FLAC Seek 精度

**风险**：VBR 格式 Seek 不精确，用户拖动进度条有误差

**缓解措施**：
- Phase 2 实现精确 Seek（seek table）
- Phase 1 使用近似估算 + 用户提示

### Risk 3: 浏览器兼容性

**风险**：毛玻璃效果（backdrop-filter）在部分浏览器不支持

**缓解措施**：
- 检测支持度，降级为纯色背景
- Chrome/Edge/Safari 主流浏览器都支持

### Risk 4: CORS 问题

**风险**：AList 未配置 CORS 导致跨域请求失败

**缓解措施**：
- 文档说明 AList CORS 配置
- 提供配置检查工具
- 错误提示引导用户配置

### Risk 5: 在线 API 依赖

**风险**：MusicBrainz/网易云音乐 API 变更或限流

**缓解措施**：
- 本地元数据优先
- 缓存在线匹配结果
- 支持禁用在线匹配
- 多 API 源备选

### Risk 6: AList 版本兼容

**风险**：不同版本 AList API 可能有差异

**缓解措施**：
- 测试主流版本
- 文档说明推荐版本
- 适配层隔离 API 差异

### Trade-off 1: 不缓存音频文件

**取舍**：
- ✅ 节省存储空间
- ✅ 避免版权问题
- ❌ 离线无法播放

**理由**：网盘音频文件通常较大，缓存不现实；用户已有网盘，网络通常可用

### Trade-off 2: 依赖 AList

**取舍**：
- ✅ 快速验证，降低开发风险
- ✅ 自动支持多网盘
- ❌ 用户需自行部署
- ❌ 依赖第三方服务

**理由**：AList 成熟稳定，用户自部署数据可控，后续可考虑直连网盘

## Migration Plan

### 部署步骤

1. **开发阶段**
   - 本地开发环境
   - 使用公共 AList 测试服务

2. **测试阶段**
   - 部署到测试环境
   - 用户自部署 AList 测试

3. **发布阶段**
   - Web 端部署到 CDN
   - Windows 客户端打包发布

### 回滚策略

- Web 端：Git 回滚 + CDN 重新部署
- Windows 客户端：提供历史版本下载
- 数据：本地存储 + AList 双重备份，数据不丢失

## Open Questions

1. **FLAC Seek Table 生成时机**
   - 选项 A：首次播放时生成并缓存
   - 选项 B：后台批量预处理
   - **倾向**：选项 A，按需生成

2. **网易云音乐 API 稳定性**
   - 非官方 API 可能变更
   - **待调研**：是否有稳定的第三方封装

3. **Windows 客户端发布策略**
   - 选项 A：GitHub Releases
   - 选项 B：Microsoft Store
   - **待定**：先 GitHub Releases，后续考虑 Store
