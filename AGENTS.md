# AGENTS.md

## Project summary

Production-oriented Telegram Mini App for the bot "Эмиль". The app is mobile-first, Russian-first, static-deployable to GitHub Pages, and also works in local browser dev mode without Telegram.

## Core commands

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

## Expectations for future agents

- Keep the product positioned as an operational control panel, not a mental health tool.
- Preserve deterministic profile generation. Do not replace it with opaque AI logic in the MVP surface.
- Keep routing hash-free. Current navigation is internal tab state.
- Preserve the storage adapter abstraction in `src/lib/storage`.
- Browser dev mode must continue to work without Telegram.
- Telegram integrations must degrade gracefully when `window.Telegram.WebApp` is unavailable.
- Maintain Russian-first concise copy.
- Avoid decorative UI changes that reduce density or control-panel clarity.

## Key files

- `src/app/App.tsx`: app shell, init, tab navigation.
- `src/app/store.ts`: Zustand state and persistence bridge.
- `src/lib/profile/deriveProfile.ts`: deterministic assistant rule mapping.
- `src/lib/storage/*`: adapter layer.
- `src/lib/telegram/*`: Telegram environment, mock, theme binding.
- `src/features/onboarding/OnboardingFlow.tsx`: onboarding flow.

## Delivery checklist

- Run `npm run typecheck`
- Run `npm run test`
- Run `npm run build`
- Verify browser dev mode renders with mock Telegram environment
- Verify onboarding completion persists state
