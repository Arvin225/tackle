## ADDED Requirements

### Requirement: Local Storage

The system SHALL store user data locally.

#### Scenario: Store playback state
- **WHEN** playback state changes (track, position, mode)
- **THEN** system saves state to localStorage

#### Scenario: Store playlists
- **WHEN** playlists are created or modified
- **THEN** system saves playlists to localStorage

#### Scenario: Store favorites
- **WHEN** favorites are modified
- **THEN** system saves favorites to localStorage

#### Scenario: Store settings
- **WHEN** user changes settings
- **THEN** system saves settings to localStorage

### Requirement: IndexedDB Metadata Cache

The system SHALL cache metadata in IndexedDB.

#### Scenario: Cache track metadata
- **WHEN** track metadata is parsed or matched
- **THEN** system caches metadata in IndexedDB

#### Scenario: Cache cover images
- **WHEN** cover is extracted or matched
- **THEN** system caches cover in IndexedDB

#### Scenario: Cache lyrics
- **WHEN** lyrics are matched
- **THEN** system caches lyrics in IndexedDB

#### Scenario: Clear cache
- **WHEN** user clears metadata cache
- **THEN** IndexedDB cache is cleared

### Requirement: AList WebDAV Sync

The system SHALL sync data to AList via WebDAV.

#### Scenario: Sync playlists to AList
- **WHEN** playlist is modified and sync is enabled
- **THEN** system uploads playlists.json to AList

#### Scenario: Sync favorites to AList
- **WHEN** favorites are modified and sync is enabled
- **THEN** system uploads favorites.json to AList

#### Scenario: Sync playback state to AList
- **WHEN** playback state changes and sync is enabled
- **THEN** system uploads playback-state.json to AList

#### Scenario: Sync settings to AList
- **WHEN** settings are modified and sync is enabled
- **THEN** system uploads settings.json to AList

### Requirement: Pull Data from AList

The system SHALL pull data from AList on startup.

#### Scenario: Pull on startup
- **WHEN** application starts and AList is connected
- **THEN** system pulls sync files from AList

#### Scenario: Merge with local data
- **WHEN** pulled data conflicts with local data
- **THEN** system uses most recent modification timestamp

#### Scenario: First sync
- **WHEN** no sync files exist on AList
- **THEN** system uploads local data as initial sync

### Requirement: Conflict Resolution

The system SHALL handle sync conflicts.

#### Scenario: Detect conflict
- **WHEN** local and remote data have different modification timestamps
- **THEN** system detects conflict

#### Scenario: Auto-resolve with timestamp
- **WHEN** conflict is detected
- **THEN** system uses data with most recent timestamp

#### Scenario: Manual conflict resolution
- **WHEN** user enables manual conflict resolution
- **THEN** system prompts user to choose local or remote data

### Requirement: Sync Status

The system SHALL display sync status.

#### Scenario: Display last sync time
- **WHEN** sync is enabled
- **THEN** system displays last successful sync timestamp

#### Scenario: Display sync error
- **WHEN** sync fails
- **THEN** system displays error message

#### Scenario: Indicate sync in progress
- **WHEN** sync is in progress
- **THEN** system displays sync indicator

### Requirement: Offline Support

The system SHALL work offline.

#### Scenario: Access cached data offline
- **WHEN** application is offline
- **THEN** system uses cached metadata from IndexedDB

#### Scenario: Queue sync when online
- **WHEN** sync is attempted while offline
- **THEN** system queues sync to retry when online

#### Scenario: Playback limited offline
- **WHEN** application is offline
- **THEN** user cannot play new tracks (audio files not cached)
