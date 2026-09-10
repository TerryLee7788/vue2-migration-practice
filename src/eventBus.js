import mitt from 'mitt'

// Vue 3 instances no longer have $on/$off/$emit, so a plain Vue instance
// can't act as an event bus anymore — use a tiny external emitter instead.
export const EventBus = mitt()
