# Contributing Guide

Thank you for your interest in contributing to **YT Reader Mode**! We want to make engineering collaboration as seamless, transparent, and exciting as possible.

## Our Model: Trunk-Based Development

The operational backbone of this project lies in the **Trunk-Based Development** model. By rigorously adhering to this practice, we dictate the following:

1. **The base branch (`main`) is immutable and inviolable to direct commits:** It must always be stable and ready for immediate production deployment.
2. **Short-Lived Feature Branches:** We do not encourage heavy branches where code diverges from the base for weeks. If you take on a ticket or proposal, break your work into minimal parts. Create a new branch from `main` (e.g., `feat/keyboard-shortcut` or `fix/broken-panel-selector`), make atomic changes, and quickly submit a Pull Request back to our trunk.
3. **Iterative Integration:** Prioritize sending multiple small Pull Requests rather than one massive one, helping the community prevent a "Merge Hell".
4. **Local Testing Responsibility:** Before requesting a review, ensure that a standard flow under `chrome://extensions/` does not reveal fatal errors unhandled by the Facade.

## Practical Workflow

1. **Fork** this repository to your personal versioning environment.
2. **Clone** the repository to your local workstation and configure an `upstream` remote to tracking recent updates.
3. Create your **short-lived specific branch** (`git checkout -b <type>/<proposition>`).
4. Write the framework and implement your adjustments.
5. Create **Commits** under atomic conventions (see below).
6. **Push** to your structure and proceed to open a **Pull Request**.

## Critical Architectural Guidelines

Since this is a Vanilla JS project restructured for survival, unbreakable rules apply before accepting mutations to `main`:

- **Strict Communication to the Kernel:** Do not inject variables or circular dependencies (e.g., executing `Controller.do()` globally). Rely entirely on `EventBus.emit/on()`.
- **YouTube Containment Barrier:** **Under no circumstances should you write manual `.querySelector` calls for YouTube nodes outside of `src/core/youtubeFacade.js`!** The engine may change tomorrow, and we need any selector patching to remain confined to that single centralized file.
- **Avoid IIFE or Dynamic Bundling:** Our modular system relies on the native way `content_scripts` interact (their own isolation). Preserve the flat and structured format provided.

## Commit Message Conventions (Conventional Commits)

Neatness is non-negotiable. Use standardized markers and concrete messages to streamline historical logs for human reading and semantic release automation:

- `feat: <short descriptive message in imperative mood>` (for new architectural additions or extension features)
- `fix: <explanation of the resolved bug>` (for resolving "crashes" and logic flaws)
- `docs: <adjustments or polishing in README/comments>`
- `refactor: <optimization of underlying algorithms without changing behavior>`
- `style: <standardization or syntax cleanup that does not alter the final product>`

---

> Welcome to the front lines! Should you have any questions regarding logic, we will gladly assist you during the Pull Request process.
