## ADDED Requirements

### Requirement: First-Time User Detection

The system SHALL detect when a user is visiting the application for the first time.

#### Scenario: Detect first visit

- **WHEN** user visits the application for the first time
- **THEN** system records this as a first visit and sets appropriate state

#### Scenario: Subsequent visits

- **WHEN** user returns to the application after first visit
- **THEN** system recognizes this is not a first visit

#### Scenario: Clear first visit data

- **WHEN** user explicitly clears application data
- **THEN** system resets first visit detection

### Requirement: WebDAV Configuration State Detection

The system SHALL detect whether WebDAV is configured.

#### Scenario: Detect unconfigured state

- **WHEN** user visits application and WebDAV is not configured
- **THEN** system detects this state and provides appropriate guidance

#### Scenario: Detect configured state

- **WHEN** user has successfully configured WebDAV
- **THEN** system recognizes WebDAV is configured

#### Scenario: Detect configuration error

- **WHEN** WebDAV configuration exists but connection fails
- **THEN** system detects configuration error state

### Requirement: Context-Aware Home Page

The system SHALL display different home page content based on application state.

#### Scenario: First visit with no WebDAV configuration

- **WHEN** user visits for first time with no WebDAV configuration
- **THEN** home page displays prominent setup guide with clear call-to-action to configure WebDAV

#### Scenario: Returning visit with no WebDAV configuration

- **WHEN** returning user has no WebDAV configuration
- **THEN** home page displays setup reminder with option to configure WebDAV

#### Scenario: WebDAV configured but no music

- **WHEN** WebDAV is configured but no music files are found
- **THEN** home page guides user to browse library or add music to WebDAV server

#### Scenario: WebDAV configured with music

- **WHEN** WebDAV is configured and music files are available
- **THEN** home page displays music playback controls and library access

### Requirement: Setup Guidance

The system SHALL provide clear guidance for setting up WebDAV configuration.

#### Scenario: Setup guide visibility

- **WHEN** user is in unconfigured state
- **THEN** system displays setup guide with step-by-step instructions

#### Scenario: Setup guide content

- **WHEN** setup guide is displayed
- **THEN** it includes:
  - Explanation of what WebDAV is
  - Instructions for setting up AList or other WebDAV server
  - Direct link to Settings page WebDAV configuration
  - Example configuration values

#### Scenario: Dismiss setup guide

- **WHEN** user clicks "Dismiss" or "Remind me later" on setup guide
- **THEN** guide is hidden but can be accessed again via help or settings

#### Scenario: Permanent dismissal

- **WHEN** user selects "Don't show again" option
- **THEN** setup guide is permanently hidden for that user

### Requirement: State Transitions

The system SHALL handle smooth transitions between application states.

#### Scenario: Transition from unconfigured to configured

- **WHEN** user successfully configures WebDAV
- **THEN** home page smoothly transitions from setup guide to normal interface

#### Scenario: State persistence

- **WHEN** user refreshes page or returns to application
- **THEN** application state (first visit, WebDAV configuration) is preserved

#### Scenario: Manual state override

- **WHEN** user wants to reset setup experience
- **THEN** system provides option in settings to reset first-time experience

### Requirement: Home Page Button Behavior

The system SHALL provide correct button behavior based on application state.

#### Scenario: Browse Library button - configured state

- **WHEN** WebDAV is configured and user clicks "Browse Library" button
- **THEN** system navigates to Library page (/library)

#### Scenario: Browse Library button - unconfigured state

- **WHEN** WebDAV is not configured and user clicks "Browse Library" button
- **THEN** system displays setup guide or navigates to Settings page with WebDAV configuration highlighted

#### Scenario: Play First Track button

- **WHEN** music is available and user clicks "Play First Track" button
- **THEN** system plays the first track in the library

#### Scenario: Configure WebDAV button

- **WHEN** user clicks "Configure WebDAV" button in setup guide
- **THEN** system navigates to Settings page with WebDAV configuration section active
