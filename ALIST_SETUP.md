# AList Configuration Guide

This guide helps you configure AList to work with the Cloud Music Player.

## What is AList?

AList is a file list program that supports multiple storages. It allows you to access files from various cloud storage services through a unified interface.

## Installation

### Docker (Recommended)

```bash
docker run -d \
  --name alist \
  -p 5244:5244 \
  -v ~/.alist:/opt/alist/data \
  -p 5173:5173 \
  xhofe/alist
```

### Binary Installation

1. Download the latest version from [AList GitHub](https://github.com/alist-org/alist/releases)
2. Extract the archive
3. Run `./alist admin` to get the admin password
4. Access at `http://localhost:5244`

## Initial Setup

1. Visit `http://localhost:5244`
2. Login with default credentials (`admin` / `admin`)
3. Change the password immediately
4. Go to "Admin → Plugins" and install desired storage drivers

## Setting Up Cloud Storage

### 1. Add Google Drive

1. Go to "Storage → Add"
2. Select "Google Drive"
3. Fill in the details:
   - Root Folder ID: Leave empty or set a specific folder
   - Token: Generate from Google Cloud Console
4. Save and test the connection

### 2. Add Baidu Netdisk

1. Go to "Storage → Add"
2. Select "Baidu Netdisk"
3. Fill in the details:
   - Cookie: Get from browser
4. Save and test the connection

### 3. Add Aliyun Drive

1. Go to "Storage → Add"
2. Select "Aliyun Drive"
3. Fill in the details:
   - Refresh Token: Get from Aliyun Drive API
4. Save and test the connection

## CORS Configuration

For the music player to work with AList, you need to enable CORS:

### Method 1: Enable CORS in AList

1. Go to "System → Settings"
2. Find "Enable CORS"
3. Set it to "True"
4. Save changes

### Method 2: Configure Reverse Proxy

If you're using Nginx, add this to your configuration:

```nginx
location / {
    proxy_pass http://localhost:5244;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

## WebDAV Access

### Get WebDAV URL

1. After configuring your storage, go to "Storage → Your Storage"
2. Copy the WebDAV URL

The URL format will be:

```
https://your-domain.com/d/your-folder-name
```

### Configure Player

1. Open the Cloud Music Player
2. Go to Settings → General → WebDAV Connection
3. Enter the WebDAV URL
4. Enter your username and password if required
5. Test the connection

## Recommended Folder Structure

```
/ music
  / albums
  / artists
  / playlists
  / genres
  / playlists
    / favorites
    / workout
    / chill
```

## Performance Tips

1. **Index Files**: Enable indexing for better performance
2. **Cache Size**: Increase cache size for better file access
3. **Sort Settings**: Set appropriate sorting for your use case
4. **Refresh Rate**: Adjust refresh rate based on your needs

## Troubleshooting

### Connection Failed

1. Check if AList is running: `docker ps` or `ps aux | grep alist`
2. Verify port 5244 is accessible
3. Check firewall settings
4. Verify storage credentials

### Files Not Loading

1. Check storage is properly configured
2. Verify file permissions
3. Check if CORS is enabled
4. Test WebDAV URL directly

### Performance Issues

1. Increase cache size
2. Disable indexing if not needed
3. Reduce refresh rate
4. Check system resources

## Security Tips

1. Use strong passwords
2. Enable two-factor authentication
3. Regularly update AList
4. Use HTTPS if possible
5. Limit access with firewalls

## Advanced Configuration

### Custom Login Page

You can customize the login page at `custom.html` in the data directory.

### Backup

Regularly backup your AList data:

```bash
# Backup using Docker
docker cp alist:/opt/alist/data /path/to/backup

# Or use rsync if running binary
rsync -avz /opt/alist/data /backup/alist-data
```

## Support

- AList GitHub: https://github.com/alist-org/alist
- AList Documentation: https://alist.nn.ci/
- AList Forum: https://github.com/alist-org/alist/discussions

---

Need help? Open an issue or join the community discussions.
