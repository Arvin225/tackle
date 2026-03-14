## ADDED Requirements

### Requirement: Create Playlist

The system SHALL allow users to create playlists.

#### Scenario: Create new playlist
- **WHEN** user creates a new playlist with a name
- **THEN** system creates an empty playlist with that name

#### Scenario: Create playlist from selection
- **WHEN** user selects multiple tracks and chooses "Add to new playlist"
- **THEN** system creates a playlist containing those tracks

### Requirement: Edit Playlist

The system SHALL allow users to edit playlists.

#### Scenario: Rename playlist
- **WHEN** user renames a playlist
- **THEN** playlist name is updated

#### Scenario: Add tracks to playlist
- **WHEN** user adds tracks to a playlist
- **THEN** tracks are appended to the playlist

#### Scenario: Remove tracks from playlist
- **WHEN** user removes tracks from a playlist
- **THEN** tracks are removed from the playlist

#### Scenario: Reorder tracks in playlist
- **WHEN** user drags a track to a new position
- **THEN** playlist order is updated

### Requirement: Delete Playlist

The system SHALL allow users to delete playlists.

#### Scenario: Delete playlist
- **WHEN** user deletes a playlist
- **THEN** playlist is removed (audio files are NOT deleted)

#### Scenario: Confirm deletion
- **WHEN** user deletes a non-empty playlist
- **THEN** system asks for confirmation

### Requirement: Queue Management

The system SHALL manage the play queue.

#### Scenario: Play track adds to queue
- **WHEN** user plays a track
- **THEN** track is added to the play queue

#### Scenario: Play next
- **WHEN** user chooses "Play next" for a track
- **THEN** track is inserted at next position in queue

#### Scenario: Add to queue
- **WHEN** user chooses "Add to queue" for a track
- **THEN** track is appended to the end of queue

#### Scenario: Clear queue
- **WHEN** user clears the queue
- **THEN** queue becomes empty except for currently playing track

#### Scenario: Remove from queue
- **WHEN** user removes a track from queue
- **THEN** track is removed from queue

### Requirement: Favorites Management

The system SHALL allow users to manage favorite tracks.

#### Scenario: Add to favorites
- **WHEN** user favorites a track
- **THEN** track is added to favorites list

#### Scenario: Remove from favorites
- **WHEN** user unfavorites a track
- **THEN** track is removed from favorites list

#### Scenario: Display favorites
- **WHEN** user opens favorites
- **THEN** system displays all favorited tracks

### Requirement: Playlist Persistence

The system SHALL persist playlists across sessions.

#### Scenario: Save playlists locally
- **WHEN** user creates or modifies a playlist
- **THEN** playlist is saved to localStorage

#### Scenario: Load playlists on startup
- **WHEN** application starts
- **THEN** system loads playlists from localStorage

### Requirement: Recent Tracks

The system SHALL track recently played tracks.

#### Scenario: Record played track
- **WHEN** a track is played for more than 30 seconds
- **THEN** track is added to recent tracks list

#### Scenario: Display recent tracks
- **WHEN** user opens recent tracks
- **THEN** system displays recently played tracks in reverse chronological order

#### Scenario: Limit recent tracks
- **WHEN** recent tracks exceed 100 items
- **THEN** oldest entries are removed
