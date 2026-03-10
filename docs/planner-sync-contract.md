# Planner Sync Contract

## Цель

Бот и Mini App работают с одним общим planner state.

- Бот принимает текст/голос, разбирает сообщение в planner items и пишет их в planner backend.
- Mini App читает и обновляет те же planner items.
- LLM не хранит планы в памяти. Он только интерпретирует сообщения и вызывает planner API.

## Основные сущности

### PlannerItem

```json
{
  "id": "item_123",
  "userId": "telegram_777000",
  "type": "task",
  "title": "Купить продукты",
  "date": "2026-03-11",
  "time": "19:00",
  "duration": null,
  "amount": null,
  "note": "Молоко и овощи",
  "status": "planned",
  "source": "bot",
  "createdAt": "2026-03-10T16:00:00.000Z",
  "updatedAt": "2026-03-10T16:00:00.000Z"
}
```

Поддерживаемые типы:
- `task`
- `event`
- `expense`
- `workout`
- `note`

### DailyCheckin

```json
{
  "id": "checkin_123",
  "userId": "telegram_777000",
  "date": "2026-03-11",
  "type": "midday_progress",
  "response": "done",
  "completed": true,
  "createdAt": "2026-03-11T11:30:00.000Z",
  "updatedAt": "2026-03-11T11:30:00.000Z"
}
```

Поддерживаемые типы:
- `evening_plan`
- `morning_kickoff`
- `midday_progress`
- `evening_review`

Поддерживаемые quick responses:
- `done`
- `move`
- `later`
- `help`

### ReminderSettings

```json
{
  "reminder": "evening",
  "tone": "business",
  "expensesEnabled": true,
  "workoutsEnabled": true
}
```

## Как бот пишет planner items

Пример: пользователь отправляет в бот

> "Завтра стоматолог в 14:00, купить продукты, вечером тренировка"

Backend вызывает:

### Create items

`POST /planner/items`

```json
{
  "userId": "telegram_777000",
  "source": "bot",
  "items": [
    {
      "type": "event",
      "title": "Стоматолог",
      "date": "2026-03-11",
      "time": "14:00"
    },
    {
      "type": "task",
      "title": "Купить продукты",
      "date": "2026-03-11"
    },
    {
      "type": "workout",
      "title": "Тренировка",
      "date": "2026-03-11",
      "time": "19:00"
    }
  ]
}
```

## Как Mini App читает и пишет planner items

### Read state

`GET /planner/state?userId=telegram_777000&from=2026-03-01&to=2026-03-31`

Ответ:

```json
{
  "items": [],
  "checkins": [],
  "reminderSettings": {
    "reminder": "evening",
    "tone": "business",
    "expensesEnabled": true,
    "workoutsEnabled": true
  }
}
```

### Create item from Mini App

`POST /planner/items`

```json
{
  "userId": "telegram_777000",
  "source": "miniapp",
  "items": [
    {
      "type": "expense",
      "title": "Продукты",
      "date": "2026-03-11",
      "amount": 1850,
      "category": "Еда"
    }
  ]
}
```

### Update item

`PATCH /planner/items/item_123`

```json
{
  "status": "done"
}
```

### Record checkin

`POST /planner/checkins`

```json
{
  "userId": "telegram_777000",
  "date": "2026-03-11",
  "type": "midday_progress",
  "response": "help",
  "completed": true
}
```

## Deep link: открыть Mini App на конкретной дате

Бот может отправлять кнопку:

> "Добавил 3 пункта на завтра"
> Кнопка: "Открыть календарь"

Mini App должен поддерживать query parameter:

`https://nightyfoxy.github.io/emil-mini-app/?date=2026-03-11`

Поведение:
- Mini App открывает календарь
- выделяет `2026-03-11`
- показывает agenda именно на эту дату

## Сценарии

### 1. Chat text -> planner items -> calendar

1. Пользователь пишет в бот.
2. Backend парсит сообщение.
3. Backend пишет planner items.
4. Mini App читает то же состояние и показывает их в календаре.

### 2. Voice transcript -> planner items -> calendar

1. Пользователь отправляет голос.
2. Backend получает transcript.
3. LLM преобразует transcript в structured items.
4. Backend пишет items в planner store.
5. Mini App показывает их на нужной дате.

### 3. Mini App add -> bot later remembers

1. Пользователь добавляет трату или задачу в Mini App.
2. Mini App пишет item в planner repository.
3. Позже бот читает planner store.
4. Бот отвечает: "На завтра у тебя уже есть..."

### 4. Evening review -> items moved to next day

1. Бот или Mini App запускает evening review.
2. Пользователь выбирает `Перенести`.
3. Backend обновляет `date` и `status`.
4. На следующий день item уже виден в календаре.

## Что сейчас реализовано в этом repo

- `PlannerRepository` abstraction
- local mock repository для dev/demo
- Mini App работает через repository, а не через прямой локальный planner state

## Что должен сделать backend

- дать реальный API adapter вместо local mock repository
- использовать один и тот же `userId` для bot и Mini App
- читать planner state перед напоминаниями, check-ins и ответами про планы
