# YT Reader Mode

A modern and lightweight browser extension designed to transform your YouTube experience. **YT Reader Mode** dynamically superimposes the native AI Chat panel ("Ask" / YouChat) over the video player, offering a focused and distraction-free reading environment.

## Main Features

- **Immersive Reader Mode:** Seamlessly toggle between the normal video and an expanded AI chat interface, synchronized exactly with the original player's dimensions.
- **Auto-activate:** Configure it to enter Reader Mode instantly on videos that feature AI capabilities.
- **Initial Prompts:** Want a summary as soon as you open the video? Set up automatic text submissions for the AI to start your conversation immediately.
- **Smart Timestamps:** Delegated integration where clicking on timestamps suggested by the model (e.g., `0:40`) automatically transitions the extension to video mode, allowing you to watch the referenced segment.

## Development Installation

Since this extension is ready to run locally, you can install it manually on Chromium-based browsers (Chrome, Edge, Brave) or Firefox:

1. Clone this repository or download the source code.
2. Open your browser and navigate to the extensions management panel (in Chrome: `chrome://extensions/`).
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select the root folder of this project.

## Internal Architecture

The project intentionally avoids complex dependencies, bundlers (like Vite or Webpack), or external tools. It is built in a pure and centralized way using Vanilla JS, following professional architectural practices:

- **Event Kernel (EventBus):** Highly efficient but decoupled logic using a strict Pub/Sub event pattern. This works to eliminate any functional interdependencies.
- **DOM Fragility Isolation (Facade):** Knowing that YouTube iteratively mutates its interface, manual DOM queries are strictly encapsulated behind the `YoutubeFacade` interface.
- **Unidirectional Flow Reactivity:** Visibility state and buttons cascade updates based on mutations originating in the `StateManager`.

## Contributing and Community

We are proud to be an Open Source project! We operate under the **Trunk-Based Development** model, which ensures a vibrant and continuous code flow.
Please read our contribution document [CONTRIBUTING.md](CONTRIBUTING.md) carefully before submitting your Pull Request to align with our versioning guidelines.
