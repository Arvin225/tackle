## ADDED Requirements

### Requirement: ID3 Tag Parsing

The system SHALL parse metadata from audio file tags.

#### Scenario: Parse MP3 ID3 tags
- **WHEN** system loads an MP3 file
- **THEN** system extracts title, artist, album, duration from ID3v1/ID3v2 tags

#### Scenario: Parse FLAC Vorbis comments
- **WHEN** system loads a FLAC file
- **THEN** system extracts title, artist, album, duration from Vorbis comments

#### Scenario: Parse M4A iTunes metadata
- **WHEN** system loads an M4A file
- **THEN** system extracts title, artist, album, duration from iTunes metadata

#### Scenario: Missing metadata
- **WHEN** audio file has no metadata tags
- **THEN** system uses filename as title and "Unknown Artist" as artist

### Requirement: Embedded Cover Extraction

The system SHALL extract embedded cover art from audio files.

#### Scenario: Extract embedded cover
- **WHEN** audio file contains embedded cover art
- **THEN** system extracts and displays the cover image

#### Scenario: Multiple embedded images
- **WHEN** audio file contains multiple embedded images
- **THEN** system uses the first image as cover

#### Scenario: No embedded cover
- **WHEN** audio file has no embedded cover
- **THEN** system attempts online cover matching

### Requirement: Online Cover Matching

The system SHALL match cover art from online sources.

#### Scenario: Match cover via MusicBrainz
- **WHEN** track has no embedded cover and title/artist are available
- **THEN** system queries MusicBrainz API for cover art

#### Scenario: Match cover via Netease Cloud Music
- **WHEN** MusicBrainz fails and track is Chinese music
- **THEN** system queries Netease Cloud Music API for cover art

#### Scenario: Cover matching failed
- **WHEN** all online sources fail
- **THEN** system displays default cover placeholder

#### Scenario: Cache matched cover
- **WHEN** cover is successfully matched
- **THEN** system caches cover in IndexedDB

### Requirement: LRC Lyrics Parsing

The system SHALL parse LRC format lyrics.

#### Scenario: Parse LRC lyrics
- **WHEN** system loads an LRC file or lyrics string
- **THEN** system parses timestamps and lyrics text

#### Scenario: Display synced lyrics
- **WHEN** track is playing
- **THEN** system displays lyrics synchronized with playback position

#### Scenario: Invalid LRC format
- **WHEN** LRC file has invalid format
- **THEN** system displays lyrics as plain text without sync

### Requirement: Online Lyrics Matching

The system SHALL match lyrics from online sources.

#### Scenario: Match lyrics via LRCLIB
- **WHEN** track has no embedded lyrics and title/artist are available
- **THEN** system queries LRCLIB API for lyrics

#### Scenario: Match lyrics via Netease Cloud Music
- **WHEN** LRCLIB fails and track is Chinese music
- **THEN** system queries Netease Cloud Music API for lyrics

#### Scenario: Lyrics matching failed
- **WHEN** all online sources fail
- **THEN** system displays "No lyrics available" message

#### Scenario: Cache matched lyrics
- **WHEN** lyrics are successfully matched
- **THEN** system caches lyrics in IndexedDB

### Requirement: Metadata Index

The system SHALL maintain an indexed metadata database.

#### Scenario: Index track metadata
- **WHEN** system scans audio files
- **THEN** system stores metadata in IndexedDB with indexes on artist, album, title

#### Scenario: Incremental update
- **WHEN** files are added, modified, or deleted
- **THEN** system updates index incrementally without full rescan

#### Scenario: Search by artist
- **WHEN** user searches by artist name
- **THEN** system returns all tracks by that artist

#### Scenario: Search by album
- **WHEN** user searches by album name
- **THEN** system returns all tracks in that album

#### Scenario: Search by title
- **WHEN** user searches by track title
- **THEN** system returns matching tracks

### Requirement: Metadata Priority

The system SHALL prioritize metadata sources.

#### Scenario: Metadata priority order
- **WHEN** track has multiple metadata sources
- **THEN** system prioritizes: embedded tags > online matched > filename
