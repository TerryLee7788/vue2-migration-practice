# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An interview-practice sandbox for the Vue 2 → Vue 3 migration. It is a small shopping-cart app
deliberately written with Vue 2 idioms, so that each idiom can be rewritten to its Vue 3
equivalent. There are two long-lived branches:

- `main` — the original Vue 2.6 + Webpack 5 baseline (unmigrated).
- `vue3-migration` (current) — the same app fully migrated to Vue 3 (Options API) + Vite.

Comments in the source are tagged `✅ 遷移點 N：...` (migration point N) at every spot a Vue 2
pattern was rewritten. When asked to review, verify, or continue "migration points," grep for
`遷移點` to enumerate them — `README.md` also keeps the authoritative checklist (14 points,
covering `main.js` down through individual components) of what changed and where.

## Commands

```bash
npm install
npm run dev      # vite dev server, http://localhost:8080
npm run build    # production build to dist/
```

There is no lint/test/typecheck script configured — this is a practice app, not a package.

## Architecture

- Entry point `src/main.js` builds the app with `createApp(App)` and chains `app.use(router)`,
  `app.use(store)`, plus a global custom directive (`v-focus`), a global mixin (`$log`), and a
  global `$bus` (mitt instance) exposed via `app.config.globalProperties`.
- `src/eventBus.js` — a `mitt()` instance replaces the Vue 2 "empty Vue instance as event bus"
  pattern, since Vue 3 instances no longer have `$on`/`$off`/`$emit`.
- `src/utils/format.js` — plain functions (`formatCurrency`, `toUppercase`) replace Vue 2 global
  filters, which were removed in Vue 3. Components call these from `computed` or `methods`
  instead of using the `{{ value | filter }}` template syntax.
- `src/router/index.js` — `createRouter({ history: createWebHistory(), routes })`, four routes:
  `/` (Home), `/products` (ProductList), `/cart` (Cart), `/form` (FormDemo).
- `src/store/index.js` — a single Vuex 4 `createStore()` with `products`/`cart` state,
  `cartCount`/`cartItems`/`cartTotal` getters, and `ADD_TO_CART`/`REMOVE_FROM_CART` mutations.
  Cart mutations rely on Vue 3's Proxy-based reactivity (direct property assignment/`delete`)
  rather than `Vue.set`/`Vue.delete`.
- Components under `src/components/` each demonstrate one specific API-surface change:
  `ProductRow.vue` (`$listeners` merged into `$attrs`, explicit `emits`), `CustomInput.vue`
  (custom `v-model` via `modelValue`/`update:modelValue` instead of the `model` option),
  `DataList.vue` (named/scoped slots consumed with `v-slot`).
- Views under `src/views/` are the pages wired into the router; each one is the practice ground
  for a cluster of migration points (see the README table for the exact mapping).

## Working conventions for this repo

- All components use the Options API — do not convert to `<script setup>` /
  Composition API unless explicitly asked; the point of this repo is the Options-API-shaped
  Vue 2 → Vue 3 migration, not a further Composition API rewrite.
- When a migration point is touched, keep the `✅ 遷移點 N：...` comment in place (updating its
  wording if the approach changes) — these comments are the practice content, not incidental
  annotations to clean up.
- Build tooling was migrated from Webpack 5 to Vite (`webpack.config.js`/`.babelrc` removed,
  `vite.config.js` added, `public/index.html` moved to project-root `index.html` with a
  `<script type="module" src="/src/main.js">` entry). Don't reintroduce Webpack config.
