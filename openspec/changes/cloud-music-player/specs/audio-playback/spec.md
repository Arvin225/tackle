## ADDED Requirements

### Requirement: Multi-format Audio Playback

The system SHALL support playback of multiple audio formats.

#### Scenario: Play MP3 file
- **WHEN** user plays an MP3 file
- **THEN** system uses native browser AudioElement for playback

#### Scenario: Play M4A/AAC file
- **WHEN** user plays an M4A or AAC file
- **THEN** system uses native browser AudioElement for playback

#### Scenario: Play FLAC file
- **WHEN** user plays a FLAC file
- **THEN** system uses libflac.js WASM decoder for playback

#### Scenario: Play WAV file
- **WHEN** user plays a WAV file
- **THEN** system uses native browser AudioElement for playback

#### Scenario: Play OGG file
- **WHEN** user plays an OGG file
- **THEN** system uses native browser AudioElement for playback

#### Scenario: Unsupported format
- **WHEN** user attempts to play an unsupported format (e.g., DSD, APE)
- **THEN** system displays "Format not supported" message

### Requirement: Playback Controls

The system SHALL provide standard playback controls.

#### Scenario: Play and pause
- **WHEN** user clicks play button
- **THEN** audio starts playing
- **AND WHEN** user clicks pause button
- **THEN** audio pauses at current position

#### Scenario: Previous track
- **WHEN** user clicks previous button
- **THEN** system plays the previous track in the queue

#### Scenario: Next track
- **WHEN** user clicks next button
- **THEN** system plays the next track in the queue

#### Scenario: Stop playback
- **WHEN** user clicks stop button
- **THEN** audio stops and position resets to beginning

### Requirement: Seek Control

The system SHALL allow users to seek to any position in the track.

#### Scenario: Seek to position
- **WHEN** user drags progress bar to a new position
- **THEN** playback jumps to that position

#### Scenario: Seek with keyboard
- **WHEN** user presses left/right arrow keys
- **THEN** playback skips backward/forward by 5 seconds

#### Scenario: Seek in FLAC file
- **WHEN** user seeks in a FLAC file
- **THEN** system calculates approximate byte offset and requests new chunk

### Requirement: Volume Control

The system SHALL allow users to adjust playback volume.

#### Scenario: Adjust volume
- **WHEN** user drags volume slider
- **THEN** volume changes accordingly

#### Scenario: Mute
- **WHEN** user clicks mute button
- **THEN** audio is muted

#### Scenario: Unmute
- **WHEN** user clicks mute button while muted
- **THEN** audio is unmuted to previous volume level

### Requirement: Playback Modes

The system SHALL support multiple playback modes.

#### Scenario: Sequential playback
- **WHEN** playback mode is set to sequential
- **THEN** tracks play in order one by one

#### Scenario: Shuffle playback
- **WHEN** playback mode is set to shuffle
- **THEN** tracks play in random order

#### Scenario: Single track loop
- **WHEN** playback mode is set to single loop
- **THEN** current track repeats after finishing

#### Scenario: Queue loop
- **WHEN** playback mode is set to queue loop
- **THEN** entire queue repeats after last track

### Requirement: Gapless Playback

The system SHALL support gapless playback between tracks.

#### Scenario: Preload next track
- **WHEN** current track reaches 80% playback
- **THEN** system preloads next track

#### Scenario: Seamless transition
- **WHEN** current track ends
- **THEN** next track starts immediately without gap

### Requirement: Playback State Persistence

The system SHALL persist playback state across sessions.

#### Scenario: Remember playback position
- **WHEN** user closes the application
- **THEN** system saves current track and playback position

#### Scenario: Resume playback
- **WHEN** user reopens the application
- **THEN** system resumes from saved position

### Requirement: Audio Quality Indication

The system SHALL display audio quality information.

#### Scenario: Display format and bitrate
- **WHEN** track is playing
- **THEN** system displays format (MP3, FLAC, etc.) and bitrate

#### Scenario: Lossless indicator
- **WHEN** playing lossless format (FLAC, WAV)
- **THEN** system displays lossless quality badge
