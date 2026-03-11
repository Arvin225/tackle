# Windows Client Development (Tauri)

This guide explains how to build a Windows desktop client using Tauri.

## Overview

Tauri is a framework for building tiny, fast binaries for all major desktop platforms. It uses a webview for the UI and Rust for the backend.

## Why Tauri?

- **Smaller Binary Size**: Tauri apps are typically 1/10th the size of Electron apps
- **Better Performance**: Uses native webview technology
- **More Secure**: Rust backend is memory-safe
- **Cross-Platform**: Build for Windows, macOS, and Linux

## Prerequisites

- Node.js 18+
- Rust toolchain (install via rustup)
- Visual Studio 2019/2022 with C++ build tools
- Electron and Tauri CLI

## Getting Started

### 1. Install Dependencies

```bash
# Install Tauri CLI
npm install --save-dev @tauri-apps/cli

# Or using cargo
cargo install tauri-cli
```

### 2. Create Tauri Project

```bash
npm create tauri-app
# Follow the prompts:
# - Choose "Tauri + React"
# - Select "JavaScript / TypeScript"
# - Choose "Vite" as the build tool
# - Select "Tauri" as the framework
```

### 3. Integrate Current Project

Once the Tauri project is created:

1. Copy your React project files into the `src` directory
2. Update imports to use relative paths if needed
3. Configure the Tauri configuration file

### 4. Configure Tauri

Edit `src-tauri/src/main.rs`:

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize your app
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Edit `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173"
  },
  "package": {
    "productName": "Cloud Music Player",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": true,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": false,
        "scope": ["**"]
      }
    },
    "bundle": {
      "active": true,
      "category": "Music",
      "copyright": "Your Name",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.yourcompany.cloudmusicplayer",
      "longDescription": "A beautiful cloud music player with WebDAV support",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "minimumSystemVersion": "",
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "Cloud Music Player",
      "targets": "all"
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 600,
        "resizable": true,
        "title": "Cloud Music Player",
        "width": 800
      }
    ]
  }
}
```

### 5. Install Tauri Dependencies

```bash
cd src-tauri
cargo install tauri-cli
cd ..
```

### 6. Run Development

```bash
npm run tauri dev
```

### 7. Build for Production

```bash
npm run tauri build
```

The built installer will be in `src-tauri/target/release/bundle/`

## Configuration

### Performance Optimization

Add to `src-tauri/tauri.conf.json`:

```json
{
  "bundle": {
    "resources": [],
    "copyright": "",
    "category": "Music",
    "shortDescription": "Cloud Music Player",
    "longDescription": "",
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/icon.icns", "icons/icon.ico"]
  },
  "tauri": {
    "builder": {
      "beforeDevCommand": "npm run dev",
      "beforeBuildCommand": "npm run build",
      "devUrl": "http://localhost:5173",
      "frontendDist": "../dist"
    },
    "withGlobalTauri": true,
    "allowlist": {
      "all": true
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "Cloud Music Player",
        "width": 1200,
        "minWidth": 800,
        "minHeight": 600,
        "center": true
      }
    ]
  }
}
```

### System Tray Integration

Add to `src-tauri/src/main.rs`:

```rust
use tauri::{
    Manager,
    SystemTray,
    SystemTrayMenu,
    SystemTrayMenuItem,
    SystemTraySubmenu,
};

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show"))
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => std::process::exit(0),
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .setup(|app| {
            // Initialize your app
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## API Integration

### WebDAV API

Create Rust bindings for WebDAV operations:

```rust
use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize)]
pub struct WebDAVConfig {
    pub url: String,
    pub username: Option<String>,
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WebDAVResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<String>,
}

#[tauri::command]
async fn test_webdav_connection(config: WebDAVConfig) -> Result<WebDAVResponse, String> {
    let client = Client::new();

    let auth = match (config.username, config.password) {
        (Some(user), Some(pass)) => {
            BasicAuth::new(user, pass)
        }
        _ => BasicAuth::parse(config.url).ok_or("Invalid URL")?,
    };

    let response = client
        .head(&config.url)
        .basic_auth(auth.username, auth.password)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(WebDAVResponse {
            success: true,
            message: "Connection successful".to_string(),
            data: None,
        })
    } else {
        Ok(WebDAVResponse {
            success: false,
            message: format!("Connection failed: {}", response.status()),
            data: None,
        })
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![test_webdav_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### System Media Controls

Add support for system media controls:

```rust
use tauri::MediaKeyCode;

#[tauri::command]
async fn send_media_command(action: String) -> Result<(), String> {
    match action.as_str() {
        "play" => SendInputAction::MediaPlayPause,
        "pause" => SendInputAction::MediaPlayPause,
        "next" => SendInputAction::MediaNextTrack,
        "previous" => SendInputAction::MediaPreviousTrack,
        _ => return Err("Invalid action".to_string()),
    };

    Ok(())
}
```

## Distribution

### Create Installers

Tauri automatically creates installers for different platforms:

```bash
# Build Windows installer
npm run tauri build

# The installer will be in: src-tauri/target/release/bundle/msi/
```

### Update Configuration

Update `src-tauri/tauri.conf.json` for production:

```json
{
  "bundle": {
    "active": true,
    "targets": ["msi", "dmg", "app"],
    "identifier": "com.yourcompany.cloudmusicplayer",
    "icon": ["icons/32x32.png", "icons/icon.icns", "icons/icon.ico"]
  },
  "updater": {
    "active": true,
    "pubkey": "YOUR_PUBLIC_KEY"
  }
}
```

## Troubleshooting

### Build Failures

1. Check Rust toolchain is properly installed
2. Verify Visual Studio build tools are installed
3. Run `cargo check` to identify issues

### Runtime Issues

1. Check console logs in the Tauri developer tools
2. Verify all required dependencies are installed
3. Check file permissions and paths

### API Issues

1. Ensure all Tauri commands are properly registered
2. Check command arguments match TypeScript interfaces
3. Verify async operations are handled correctly

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_webdav_config() {
        let config = WebDAVConfig {
            url: "http://localhost:5244".to_string(),
            username: Some("admin".to_string()),
            password: Some("admin".to_string()),
        };

        assert_eq!(config.url, "http://localhost:5244");
    }
}
```

### Integration Tests

Test your Tauri commands:

```rust
#[tokio::test]
async fn test_webdav_connection_test() {
    let config = WebDAVConfig {
        url: "http://localhost:5244".to_string(),
        username: Some("admin".to_string()),
        password: Some("admin".to_string()),
    };

    let response = test_webdav_connection(config).await;
    assert!(response.success);
}
```

## Performance Tips

1. Use code splitting and lazy loading
2. Optimize asset sizes
3. Use native storage APIs instead of web APIs
4. Enable caching for frequent operations
5. Profile with tools like `perf` or `cargo-flamegraph`

## Security Best Practices

1. Validate all user inputs
2. Use proper authentication
3. Avoid storing sensitive data in plain text
4. Keep dependencies updated
5. Use Tauri's built-in security features

## Future Enhancements

- System Tray integration with persistent controls
- Hotkeys for playback control
- File drag and drop
- Native file dialogs
- Quick settings menu

## Support

For Tauri-specific issues:

- Tauri Documentation: https://tauri.app/
- Tauri Examples: https://github.com/tauri-apps/tauri/tree/dev/examples
- Rust Documentation: https://doc.rust-lang.org/

---

Happy building! 🚀
