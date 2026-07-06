import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  EventBus._listeners = {};
});

describe('EventBus.on()', () => {
  it('registers a listener for an event', () => {
    const fn = () => {};
    EventBus.on('test', fn);
    expect(EventBus._listeners.test).toEqual([fn]);
  });

  it('supports multiple listeners for the same event', () => {
    const a = () => {};
    const b = () => {};
    EventBus.on('evt', a);
    EventBus.on('evt', b);
    expect(EventBus._listeners.evt).toHaveLength(2);
  });

  it('supports multiple different events', () => {
    EventBus.on('a', () => {});
    EventBus.on('b', () => {});
    expect(Object.keys(EventBus._listeners)).toEqual(['a', 'b']);
  });
});

describe('EventBus.emit()', () => {
  it('calls all listeners for the event', () => {
    const calls = [];
    EventBus.on('evt', (p) => calls.push(['a', p]));
    EventBus.on('evt', (p) => calls.push(['b', p]));
    EventBus.emit('evt', 'x');
    expect(calls).toEqual([['a', 'x'], ['b', 'x']]);
  });

  it('passes the payload to each listener', () => {
    const spy = (p) => { captured = p; };
    let captured;
    EventBus.on('evt', spy);
    EventBus.emit('evt', { n: 42 });
    expect(captured).toEqual({ n: 42 });
  });

  it('does nothing when no listeners exist', () => {
    expect(() => EventBus.emit('nonexistent', 1)).not.toThrow();
  });
});

describe('EventBus.off()', () => {
  it('removes a specific listener', () => {
    const a = () => {};
    const b = () => {};
    EventBus.on('evt', a);
    EventBus.on('evt', b);
    EventBus.off('evt', a);
    expect(EventBus._listeners.evt).toEqual([b]);
  });

  it('does nothing when the listener is not registered', () => {
    EventBus.on('evt', () => {});
    expect(() => EventBus.off('evt', () => {})).not.toThrow();
    expect(EventBus._listeners.evt).toHaveLength(1);
  });

  it('does nothing when the event has no listeners', () => {
    expect(() => EventBus.off('nonexistent', () => {})).not.toThrow();
  });
});
