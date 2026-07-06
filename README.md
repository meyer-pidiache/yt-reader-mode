# YT Reader Mode

A modern and lightweight browser extension designed to transform your YouTube experience. **YT Reader Mode** dynamically superimposes the native AI Chat panel ("Ask" / YouChat) over the video player, offering a focused and distraction-free reading environment.

## Main Features

- **Immersive Reader Mode:** Seamlessly toggle between the normal video and an expanded AI chat interface, synchronized exactly with the original player's dimensions.
- **Auto-activate:** Configure it to enter Reader Mode instantly on videos that feature AI capabilities.
- **Initial Prompts:** Want a summary as soon as you open the video? Set up automatic text submissions for the AI to start your conversation immediately.
- **Smart Timestamps:** Delegated integration where clicking on timestamps suggested by the model (e.g., `0:40`) automatically transitions the extension to video mode, allowing you to watch the referenced segment.

## Prerequisites

- **Node.js >= 20** and **pnpm** (or npm)

## Development Installation

### Chromium-based browsers (Chrome, Edge, Brave)

1. Clone this repository or download the source code.
2. Install dependencies:

   ```bash
   pnpm install
   ```
3. Open your browser and navigate to the extensions management panel (in Chrome: `chrome://extensions/`).
4. Enable **Developer mode**.
5. Click on **Load unpacked** and select the root folder of this project.

### Firefox (using web-ext)

[web-ext](https://extensionworkshop.com/documentation/web-ext/) is Mozilla's official CLI for WebExtension development. It provides linting, auto-reload, building, and signing.

1. Clone this repository and install dependencies:

   ```bash
   git clone git@github.com:meyer-pidiache/yt-reader-mode.git
   cd yt-reader-mode
   pnpm install
   ```

2. **Lint** the extension against AMO rules:

   ```bash
   pnpm run lint
   ```

3. **Run** the extension in Firefox with auto-reload:

   ```bash
   pnpm run start
   ```

   This launches Firefox with the extension temporarily installed. Changes to the source files trigger an automatic reload.

4. **Build** a production `.zip` for manual submission:

   ```bash
   pnpm run build
   ```

   The built artifact is written to `web-ext-artifacts/`.

5. **Sign** the extension for AMO distribution (requires API credentials):

   ```bash
   # Set your AMO API credentials first:
   export WEB_EXT_API_KEY=...
   export WEB_EXT_API_SECRET=...
   pnpm run sign
   ```

   See [Signing & Publishing](https://extensionworkshop.com/documentation/publish/signing-and-distribution/) for details on obtaining API credentials.

## Internal Architecture

The project intentionally avoids complex dependencies, bundlers (like Vite or Webpack), or external tools. It is built in a pure and centralized way using Vanilla JS, following professional architectural practices:

- **Event Kernel (EventBus):** Highly efficient but decoupled logic using a strict Pub/Sub event pattern. This works to eliminate any functional interdependencies.
- **DOM Fragility Isolation (Facade):** Knowing that YouTube iteratively mutates its interface, manual DOM queries are strictly encapsulated behind the `YoutubeFacade` interface.
- **Unidirectional Flow Reactivity:** Visibility state and buttons cascade updates based on mutations originating in the `StateManager`.

## Contributing and Community

We are proud to be an Open Source project! We operate under the **Trunk-Based Development** model, which ensures a vibrant and continuous code flow.

Please read our contribution document [CONTRIBUTING.md](CONTRIBUTING.md) carefully before submitting your Pull Request to align with our versioning guidelines.

## License

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE.md). It is free to use, modify, and distribute for personal and non-commercial purposes. Commercial use is strictly prohibited without explicit permission.
