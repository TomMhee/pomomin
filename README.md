# 🍅 Pomodoro Timer

> A minimal, beautiful desktop Pomodoro timer with lofi music support

[![Latest Release](https://img.shields.io/github/v/release/TomMhee/pomomin?style=for-the-badge&logo=github)](https://github.com/TomMhee/pomomin/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/TomMhee/pomomin/total?style=for-the-badge&color=brightgreen)](https://github.com/TomMhee/pomomin/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue?style=for-the-badge)](https://github.com/TomMhee/pomomin/releases)

## ✨ Features

- **🎯 Classic Pomodoro Technique** - 25/5/25/5/25/5/25/15 minute cycles
- **🎵 Lofi Music Support** - Add your own relaxing background tracks
- **🌙 Dark Theme** - Easy on the eyes during long work sessions
- **🔔 Desktop Notifications** - Never miss a break or work session
- **⌨️ Keyboard Shortcuts** - Space to start/pause, arrow keys to skip
- **🍅 System Tray** - Minimizes to your system tray with tomato icon
- **📱 Minimal Interface** - Clean, distraction-free design
- **🔊 Volume Control** - Adjust music volume to your preference

## 📥 Download

Choose your platform:

| Platform | Download | Size |
|----------|----------|------|
| **Windows** | [📦 Installer (.exe)](https://github.com/TomMhee/pomomin/releases/latest/download/Pomodoro-Timer-Setup-1.0.11.exe) | ~150MB |
| **macOS** | [💿 Disk Image (.dmg)](https://github.com/TomMhee/pomomin/releases/latest/download/Pomodoro-Timer-1.0.11.dmg) | ~200MB |
| **Linux** | Coming Soon! 🐧 | - |

> 💡 **Tip**: Check the [Releases page](https://github.com/TomMhee/pomomin/releases) for all versions

## 🚀 Quick Start

1. **Download** the installer for your platform
2. **Install** the app:
   - **Windows**: Run the `.exe` installer
   - **macOS**: Open the `.dmg`, drag to Applications, then [see macOS security note below](#-macos-security-note)
3. **Add music** (optional):
   - Place `work_lofi.wav` in the app folder for work sessions
   - Place `break_lofi.wav` for break sessions
4. **Launch** and start your first Pomodoro! 🍅

### 🍎 macOS Security Note

macOS may show a security warning because the app isn't code signed. This is normal for indie apps. To install:

1. **Right-click** the app → **"Open"**
2. **Click "Open"** when prompted
3. Or go to **System Preferences** → **Security & Privacy** → **"Open Anyway"**

The app is completely safe - this is just Apple's security measure for unsigned apps.

## 🎵 Adding Your Music

To add your own lofi music, place the files in the app's installation directory:

### Windows
After installing with the `.exe`:
```
C:\Users\[YourUsername]\AppData\Local\Programs\Pomodoro Timer\resources\app\
├── work_lofi.wav    (for work sessions)
└── break_lofi.wav   (for breaks)
```

**Quick way to find it:**
1. Right-click the Pomodoro Timer desktop shortcut
2. Select "Open file location"
3. Navigate to the `resources\app\` folder
4. Place your `.wav` files here

### macOS
After installing with the `.dmg`:
```
/Applications/Pomodoro Timer.app/Contents/Resources/app/
├── work_lofi.wav    (for work sessions)
└── break_lofi.wav   (for breaks)
```

**Quick way to find it:**
1. Find Pomodoro Timer in Applications
2. Right-click → "Show Package Contents"
3. Navigate: `Contents` → `Resources` → `app`
4. Place your `.wav` files here

### 🎧 Music File Requirements
- **Format**: `.wav` files (best compatibility)
- **Names**: Must be exactly `work_lofi.wav` and `break_lofi.wav`
- **Length**: 25+ minutes recommended to avoid repetition
- **Quality**: Any quality works, but 44.1kHz 16-bit is ideal

### 🎵 Music Recommendations
- **Work sessions**: Calm, instrumental lofi beats
- **Break sessions**: Slightly more upbeat, still relaxing
- **Sources**: YouTube (use a converter), Spotify local files, or lofi music websites

> 💡 **Tip**: Restart the app after adding music files for them to be detected

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `→` | Skip current session |
| `Escape` | Reset to home screen |

## 🖼️ Screenshots

*Coming soon! Screenshots of the beautiful interface.*

## 🏗️ Built With

- **[Electron](https://electronjs.org/)** - Cross-platform desktop framework
- **JavaScript** - Core application logic
- **HTML5 Audio** - Music playback
- **GitHub Actions** - Automated building and releases

## 📊 How It Works

The Pomodoro Technique is a time management method:

1. **🍅 Work** for 25 minutes
2. **☕ Short break** for 5 minutes
3. **Repeat** 3 more times
4. **🏖️ Long break** for 15 minutes

This app automates the timing and provides a beautiful interface to keep you focused and productive.

## 🤝 Contributing

Found a bug or have a feature request? 

1. Check existing [Issues](https://github.com/TomMhee/pomomin/issues)
2. Create a new issue with details
3. Or submit a Pull Request!

## 📋 Roadmap

- [ ] Linux support (.AppImage, .deb)
- [ ] Built-in music library
- [ ] Custom session lengths
- [ ] Productivity statistics
- [ ] Multiple timer themes
- [ ] Break activity suggestions
- [ ] Integration with task managers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- Built for developers and creatives who need focused work sessions
- Special thanks to the lofi music community for providing relaxing beats

## 💬 Support

Having issues? Here's how to get help:

- 🐛 **Bug reports**: [Create an issue](https://github.com/TomMhee/pomomin/issues/new)
- 💡 **Feature requests**: [Create an issue](https://github.com/TomMhee/pomomin/issues/new)
- 💬 **Questions**: Check existing issues or start a discussion

---

<div align="center">

**⭐ Star this repo if it helps your productivity!**

Made with ❤️ for the productivity community

[Download Now](https://github.com/TomMhee/pomomin/releases/latest) • [Report Bug](https://github.com/TomMhee/pomomin/issues) • [Request Feature](https://github.com/TomMhee/pomomin/issues)

</div>