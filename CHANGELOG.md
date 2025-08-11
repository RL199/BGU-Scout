# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2]

### Fixed
- Popup page "Don't close the window" message color.
- Options page "Course names updated" message translation.

## [1.4.1]

### Added
- "Don't close the window" message when loading course files.

### Changed
- Updated translations api to chrome.i18n

### Fixed
- button glow effect not using theme colors.
- Icon color not updating correctly on browser start.
- Options page icon not updating correctly.

## [1.4.0]

### Added
- chrome web store link in "About" page
- Course File button

### Changed
- In Popup page, year to year input changed to year span
- Year span input support for both orders (left to right and right to left)
- Popup page centered layout

### Fixed
- "About" page not fully displaying on new user setup
- Converting course names working properly when a course number is invalid.

## [1.3.0]

### Added
- Course name language conversion feature
- New color scheme options: Blue, Green, Pink, Purple.

### Changed

### Fixed
- "missing" highlight removal for popup page checkboxes.
- Small Security improvements.

### Removed
- "multiple display" toggle from popup page, as the mode is now the default.


## [1.2.1]

### Fixed
- Fix bug with opening new graph page
- Under the hood improvements


## [1.2.0]

### Added
- About page with extension details
- Support for multiple course displays

### Changed
- New options page design
- New popup page design

### Fixed
- Minor bugs and UI elements

## [1.1.3] - 2025-03-26

### Changed
- Enhance Moodle course name cleanup

### Fixed
- Improve user feedback, fix #8

## [1.1.2] - 2025-03-06

### Added
- Enhance form validation with error highlighting

## [1.1.1] - 2025-03-06

### Added
- Enhance release workflow to include PR details and comparison links

### Fixed
- Update copyright year in LICENSE file to 2025

## [1.1.0] - 2025-03-05

### Added
- Departmental details toggle feature
- Toast message for course removal notification

### Changed
- Enhanced course name extraction from Moodle by removing semester numbers
- Update CSS structure for course labels to improve styling consistency

### Fixed
- Fixed issue when closing the page during loading, the script URL won't close
- Improve toast message handling by preventing multiple timeouts
- Update validation logic and remove deprecated scripts

### Removed
- Unnecessary scripting and hosts permissions

## [1.0.1] - 2025-03-02

### Fixed
- Small fixes and improvements

## [1.0.0] - 2025-02-27

### Added
- Option to edit course names in the options page

### Changed
- Improved user credentials security

### Fixed
- Lots of small fixes and improvements

### Removed
- Unnecessary permissions for improved privacy and security

## [0.9.1-beta] - 2025-02-07

### Changed
- Options UI to support wider screens

### Fixed
- Minor bugs and UI elements

## [0.9.0-beta] - 2025-02-07

### Added
- Course number validation and automatic course name adding
- Better first use interaction

### Changed
- Remove key field from popup page and implement automatic key handling
- Minor UI UX changes of options and popup pages

### Fixed
- Fixed bugs and added scenarios handling
- Lots of under the hood fixes and changes

## [0.8.0-beta] - 2025-02-03

### Added
- Initial BGU Scout Extension release
- Course Statistics Visualization
- Dark/Light Mode Support
- Bilingual Support
- Course Management
- Quick Access
- User Data Management
