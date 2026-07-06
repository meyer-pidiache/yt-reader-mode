// Import source files as ESM (vitest plugin injects export statements).
// Set them as globals so tests match the browser extension environment.
import { EventBus } from './core/eventBus.js';
import { StateManager } from './core/stateManager.js';

globalThis.EventBus = EventBus;
globalThis.StateManager = StateManager;
