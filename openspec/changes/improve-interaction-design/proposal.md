## Why

当前音乐播放器应用存在严重的交互设计问题，导致用户体验差。新用户首次访问时无法找到WebDAV配置入口，缺乏应用级导航系统，主页按钮逻辑错误，且整体交互不符合Apple人机界面指南。这些问题阻碍了用户使用应用的核心功能（播放WebDAV上的音乐），降低了应用的可用性和用户满意度。

## What Changes

1. **添加应用级导航系统**：在顶部或侧边添加导航栏，允许用户在主页、音乐库、播放列表和设置页面间切换
2. **改进首次使用体验**：当检测到未配置WebDAV时，显示引导式配置流程
3. **修复主页逻辑错误**：修正"Browse Library"按钮的行为，使其正确导航到音乐库页面
4. **添加状态感知界面**：根据应用状态（未配置、已配置无音乐、有音乐）动态调整界面
5. **遵循Apple HIG原则**：确保交互设计符合Apple人机界面指南的清晰性、一致性、直接操作、反馈和用户控制原则
6. **添加WebDAV配置持久化**：修复WebDAV配置的保存和加载功能

**BREAKING**: 主页的"Browse Library"按钮行为将从尝试播放第一首音乐改为导航到音乐库页面

## Capabilities

### New Capabilities

- **app-navigation**: 应用级导航系统，包括顶部/侧边导航栏和面包屑导航
- **first-time-experience**: 首次使用引导和状态感知界面
- **webdav-config-persistence**: WebDAV配置的持久化存储和状态管理

### Modified Capabilities

- **apple-ui**: 需要添加导航组件和交互模式以满足Apple HIG要求
- **webdav-integration**: 需要改进配置流程和用户引导

## Impact

1. **前端组件**：
   - 需要创建新的导航组件（NavigationBar, Sidebar等）
   - 修改HomePage组件以支持状态感知界面
   - 更新WebDAVConfig组件以支持持久化和更好的用户体验

2. **状态管理**：
   - 需要添加应用状态管理（首次使用标志、WebDAV配置状态）
   - 修改useWebDAV hook以支持配置持久化

3. **路由系统**：
   - 需要更新App.tsx以包含导航组件
   - 可能需要添加路由守卫来引导未配置用户

4. **用户体验**：
   - 显著改善首次使用体验
   - 提高应用的可发现性和可用性
   - 符合Apple设计标准，提升专业感
