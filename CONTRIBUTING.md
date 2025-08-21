# Contributing to Pomodoro Timer

Thanks for your interest in contributing! 🎉

## 🐛 Reporting Bugs

Before creating a bug report, please check if the issue already exists in our [Issues](https://github.com/TomMhee/pomomin/issues).

When creating a bug report, include:

- **OS and version** (Windows 10, macOS 13, etc.)
- **App version** (found in About menu)
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Screenshots** if applicable

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check existing issues for similar requests
2. Describe the feature and why it would be useful
3. Consider how it fits with the app's minimal design philosophy

## 🔧 Development Setup

```bash
# Clone the repo
git clone https://github.com/TomMhee/pomomin.git
cd pomomin

# Install dependencies  
npm install

# Run in development
npm start

# Build for production
npm run dist
```

## 📋 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### PR Guidelines

- Keep changes focused and atomic
- Include clear commit messages
- Test your changes locally
- Update documentation if needed
- Follow the existing code style

## 🎨 Design Philosophy

This app follows these principles:

- **Minimal** - Clean, distraction-free interface
- **Fast** - Quick startup and responsive interactions
- **Focused** - Does one thing well (Pomodoro timing)
- **Beautiful** - Modern, accessible design

## 📝 Code Style

- Use meaningful variable names
- Comment complex logic
- Follow existing patterns
- Keep functions small and focused

## 🚀 Release Process

Releases are automated via GitHub Actions when tags are pushed:

```bash
git tag v1.0.12
git push origin v1.0.12
```

This triggers builds for Windows and macOS.

## 📞 Questions?

Feel free to open an issue with the "question" label if you need clarification on anything!

Thanks for contributing! 🍅