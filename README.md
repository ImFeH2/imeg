# ImI

[English](./README.md) | [简体中文](./README.zh.md)

A no-code content sharing platform (in development).

## Project Overview

ImI is a decentralized, no-code content sharing platform currently in early development, with the no-code editor functionality being implemented. Through drag-and-drop editing, users can easily create and edit content without writing code.

## Current Features

- Drag-and-drop page editing
- Free component placement and adjustment
- Real-time preview
- Properties panel configuration
- Undo/redo support
- Responsive layout

## Quick Start

First, clone the project locally:

```bash
git clone https://github.com/ImFeH2/imi.git
```

### Frontend Development

Ensure your development environment meets the following requirements:

- Node.js (v16+)
- npm or yarn

```bash
# Enter frontend directory
cd imi/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Development

Rust development environment is required:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Enter backend directory
cd imi/backend

# Compile and run
cargo run
```

## Tech Stack

- **Frontend**
    - React
    - TypeScript
    - Tailwind CSS
    - Vite
- **Backend**
    - Rust

## Development Plan

- [ ] Enhance editor functionality
    - [ ] More preset components
    - [ ] Custom components
- [ ] Design data structures
- [ ] Develop backend API

## Contributing

Issues and Pull Requests are welcome.

## Author

ImFeH2 (i@feh2.im)

## License

[Apache-2.0 License](./LICENSE)
