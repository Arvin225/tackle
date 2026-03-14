## ADDED Requirements

### Requirement: WebDAV Connection Configuration

The system SHALL allow users to configure WebDAV connection to AList server.

#### Scenario: Configure with username and password
- **WHEN** user provides AList server URL, username, and password
- **THEN** system stores the configuration and validates the connection

#### Scenario: Configure with token
- **WHEN** user provides AList server URL and access token
- **THEN** system stores the configuration and validates the connection

#### Scenario: Invalid connection
- **WHEN** user provides invalid credentials or unreachable server
- **THEN** system displays an error message and does not save the configuration

### Requirement: WebDAV Authentication

The system SHALL support both username/password and token-based authentication.

#### Scenario: Authenticate with username and password
- **WHEN** user connects using username and password
- **THEN** system sends Basic Auth header in WebDAV requests

#### Scenario: Authenticate with token
- **WHEN** user connects using token
- **THEN** system sends token in Authorization header

#### Scenario: Authentication expired
- **WHEN** authentication token expires
- **THEN** system prompts user to re-authenticate

### Requirement: Directory Browsing

The system SHALL allow users to browse directories on WebDAV server.

#### Scenario: List directory contents
- **WHEN** user opens a directory
- **THEN** system displays all files and subdirectories

#### Scenario: Navigate to subdirectory
- **WHEN** user clicks on a subdirectory
- **THEN** system navigates into that directory and displays its contents

#### Scenario: Navigate to parent directory
- **WHEN** user clicks back or parent button
- **THEN** system navigates to parent directory

### Requirement: Audio File Detection

The system SHALL automatically detect audio files in directories.

#### Scenario: Display audio files
- **WHEN** directory contains audio files (mp3, m4a, flac, wav, ogg)
- **THEN** system displays them with audio icon

#### Scenario: Filter audio files
- **WHEN** user enables audio-only filter
- **THEN** system displays only audio files

### Requirement: File Streaming

The system SHALL stream audio files from WebDAV server using Range requests.

#### Scenario: Request file with Range header
- **WHEN** system requests an audio file
- **THEN** system uses HTTP Range header for chunked loading

#### Scenario: Partial content response
- **WHEN** server supports Range requests
- **THEN** system receives 206 Partial Content response

#### Scenario: Server does not support Range
- **WHEN** server does not support Range requests
- **THEN** system falls back to full file download for small files (<50MB)
