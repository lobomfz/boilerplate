# Boilerplate

Fullstack monorepo with Bun.

## Stack

### Frontend

- **React 19** - UI
- **TanStack Router** - file-based routing
- **TanStack Query** - data fetching and cache
- **Zustand** - state management
- **Tailwind 4** - styling
- **Radix UI** - accessible components

### Backend

- **Bun** - runtime and bundler
- **ORPC** - typesafe RPC (HTTP + WebSocket)
- **Kysely** - typesafe query builder

### Validation

- **Arktype** - schemas and runtime validation

## WebSockets and PubSub

The boilerplate uses ORPC for both HTTP and WebSocket. The pub/sub system enables realtime events.

### Publishing events

```typescript
await PubSub.publish("notification", visitorId, { title: "Hello", message: "..." });
```

### Subscribing (WebSocket procedure)

```typescript
notifications: protectedProcedure.handler(({ context, signal }) =>
  PubSub.subscribe("notification", visitorId, signal),
),
```

### Consuming on frontend

```typescript
const { data: events } = useQuery(
  orpcWs.notifications.experimental_streamedOptions({ enabled: true }),
);
```

## Dev

```bash
bun install
bun dev
```
