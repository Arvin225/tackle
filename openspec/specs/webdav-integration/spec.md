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

### Requirement: WebDAV Configuration Persistence

The system SHALL persistently store and retrieve WebDAV configuration.

#### Scenario: Load saved configuration on startup

- **WHEN** application starts
- **THEN** system loads previously saved WebDAV configuration from persistent storage

#### Scenario: Configuration survives browser restart

- **WHEN** user closes and reopens browser
- **THEN** WebDAV configuration is restored from persistent storage

#### Scenario: Clear configuration

- **WHEN** user chooses to clear WebDAV configuration
- **THEN** system removes configuration from persistent storage

### Requirement: WebDAV Configuration User Interface

The system SHALL provide an intuitive user interface for WebDAV configuration.

#### Scenario: Configuration form pre-filling

- **WHEN** user opens WebDAV configuration page
- **THEN** form fields are pre-filled with saved configuration values

#### Scenario: Configuration status display

- **WHEN** WebDAV configuration page is displayed
- **THEN** UI shows current configuration status (not configured, configured, connected, error)

#### Scenario: Configuration change detection

- **WHEN** user modifies configuration form
- **THEN** UI indicates unsaved changes and enables save button

#### Scenario: Configuration save feedback

- **WHEN** user saves configuration
- **THEN** UI provides clear feedback (success message, error message with details)

### Requirement: WebDAV Configuration Guidance

The system SHALL provide guidance for users setting up WebDAV configuration.

#### Scenario: First-time configuration guidance

- **WHEN** user visits application for first time with no WebDAV configuration
- **THEN** system provides step-by-step guidance for setting up WebDAV

#### Scenario: Configuration help

- **WHEN** user needs help with WebDAV configuration
- **THEN** system provides help content explaining WebDAV, AList setup, and example configurations

#### Scenario: Configuration validation guidance

- **WHEN** configuration fails validation or connection test
- **THEN** system provides specific guidance on how to fix the issue

### Requirement: WebDAV Configuration State Management

The system SHALL manage WebDAV configuration state throughout the application.

#### Scenario: Configuration state propagation

- **WHEN** WebDAV configuration changes
- **THEN** all components using WebDAV are notified of the change

#### Scenario: Configuration-dependent UI

- **WHEN** WebDAV configuration state changes (configured/unconfigured/connected/error)
- **THEN** UI adapts to show appropriate content and options

#### Scenario: Configuration in navigation

- **WHEN** WebDAV is not configured
- **THEN** navigation may highlight or emphasize the Settings page

### Requirement: Multiple WebDAV Configurations

The system SHALL support multiple WebDAV configurations.

#### Scenario: Save multiple configurations

- **WHEN** user wants to connect to multiple WebDAV servers
- **THEN** system allows saving and naming multiple configurations

#### Scenario: Switch between configurations

- **WHEN** user has multiple WebDAV configurations saved
- **THEN** system allows switching between configurations

#### Scenario: Configuration management

- **WHEN** user wants to manage configurations
- **THEN** system provides interface to view, edit, and delete saved configurations
