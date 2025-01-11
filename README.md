# <div align="center">BGU Courses Extension</div>

<div align="center">
  <a href="https://github.com/RL199/BGU-courses">
    <img src="https://img.shields.io/github/license/RL199/BGU-courses?style=flat-square" alt="license">
  </a>
</div>

<p align="center">
  <em>A Chrome extension that helps BGU students easily access and visualize course statistics and grades.</em>
</p>

---

## 🎯 Features

- **Course Statistics Visualization**: Generate graphical representations of course statistics and grades
- **Dark/Light Mode Support**: Automatic theme switching based on system preferences or manual selection
- **Bilingual Support**: Full Hebrew and English language support
- **Course Management**: Save and manage multiple course numbers for quick access
- **Quick Access**: Direct links to BGU's login portal and grade system
- **User Data Management**: Securely store and manage user credentials

## ⚙️ Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should now appear in your Chrome toolbar

## 🔧 Configuration

1. Click the extension icon to open the popup interface
2. Click "Options" to configure:
   - Username and ID
   - Theme preference (Light/Dark/System)
   - Language preference (English/Hebrew/System)
   - Course numbers
3. Save your settings
4. Use the popup interface to generate grade statistics and access BGU systems

## 🛠️ Technical Details

### Technologies Used
- HTML5
- CSS3 with CSS Variables for theming
- Vanilla JavaScript
- Chrome Extension APIs
  - Storage API
  - Tabs API
  - Scripting API

### Features Implementation
- **Theme System**: Uses CSS variables for consistent theming across all components
- **Localization**: Built-in translation system for Hebrew and English
- **Form Validation**: Client-side validation for course numbers and user input
- **Storage Management**: Efficient use of Chrome's storage sync API

## 🔒 Permissions

The extension requires the following permissions:
- `storage`: For saving user preferences and course numbers
- `tabs`: For opening BGU websites
- `activeTab`: For interacting with the current tab
- Host permissions for BGU domains:
  - `https://bgu4u22.bgu.ac.il/*`
  - `https://reports4u22.bgu.ac.il/*`

## 👥 Contributing

Feel free to open issues and submit pull requests. Please ensure your code follows the existing style and includes appropriate documentation.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔍 Browser Support

- Chrome: Latest version
- Chromium-based browsers (Edge, Opera, etc.): Latest versions

---

<p align="center">
  Made with ❤️ for BGU Students
</p>
