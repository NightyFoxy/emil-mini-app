# Эмиль Mini App

Telegram Mini App для бота "Эмиль": короткий онбординг, операционный профиль пользователя и мобильная control-panel для Today / Inbox / Focus / Week / Profile.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS v4
- Zustand
- Zod
- Vitest
- `@tma.js/sdk`
- `@tma.js/sdk-react`

## Что внутри

- Онбординг на 12 шагов с прогрессом и детерминированной генерацией профиля.
- Операционный профиль с `profile_json`, `llm_profile_summary`, `assistantRules[]`.
- Экраны `Today`, `Inbox`, `Focus`, `Week`, `Profile`.
- Storage adapter layer: `localStorage` для dev/browser и Telegram Cloud Storage при наличии WebApp API.
- Telegram theme binding, safe-area paddings, browser dev fallback с mock WebApp.
- Статический build для GitHub Pages.

## Быстрый старт

```bash
npm install
npm run dev
```

Локальный dev-режим работает и вне Telegram. В `import.meta.env.DEV` автоматически поднимается mock `window.Telegram.WebApp`, чтобы можно было проверять тему, профиль и Cloud Storage fallback.

## Команды

```bash
npm run dev
npm run typecheck
npm run test
npm run build
```

## Режимы запуска

### Browser dev mode

1. Запустите `npm run dev`.
2. Откройте локальный URL Vite.
3. Приложение автоматически включит Telegram mock и demo-state.

### Telegram mode

1. Задеплойте frontend на GitHub Pages.
2. Возьмите итоговый Pages URL, например `https://<user>.github.io/<repo>/`.
3. В BotFather откройте настройки Mini App для бота и укажите этот URL как Mini App URL.
4. Откройте Mini App внутри Telegram. Если WebApp API доступен, приложение возьмёт theme params, safe areas и попытается использовать Telegram Cloud Storage.

## GitHub Pages

Workflow уже добавлен в `.github/workflows/deploy-pages.yml`.

Что важно:

- `vite.config.ts` автоматически ставит `base` из `GITHUB_REPOSITORY` внутри GitHub Actions.
- Для публикации нужен включённый Pages source: `GitHub Actions`.

### Как подключить Pages

1. Создайте GitHub repository.
2. Запушьте код в `main`.
3. В GitHub откройте `Settings -> Pages`.
4. В `Build and deployment` выберите `Source: GitHub Actions`.
5. Дождитесь успешного workflow `Deploy GitHub Pages`.

## Структура

```text
src/
  app/
  components/
  features/
  lib/
  test/
  types/
```

## Профиль пользователя

Профиль валидируется через Zod schema `src/lib/profile/schemas.ts`.

Основные поля:

- `profileVersion`
- `displayName`
- `goals`
- `chaosSources`
- `planningStyle`
- `dailyPriorityCapacity`
- `energyPattern`
- `accountabilityStyle`
- `mainBlockers`
- `preferredOutputFormats`
- `reminderTime`
- `avoidPhrases`
- `startHelps`
- `assistantRules`
- `llmProfileSummary`
- `createdAt`
- `updatedAt`

## Деплой вручную, если GitHub уже есть

```bash
git init
git checkout -b main
git add .
git commit -m "Build Emil Telegram Mini App"
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

После этого включите Pages через GitHub Actions и используйте URL вида `https://<USER>.github.io/<REPO>/`.
