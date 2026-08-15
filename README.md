# Dose

**Medication tracking for the whole family.** Dose helps households keep track of who takes what, when — with daily doses, adherence rates, streaks and history in one place.

🔗 **Live:** [dose-azure.vercel.app](https://dose-azure.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## The problem

Households with more than one person on medication run into the same failure mode: nobody has a shared, reliable picture of what was actually taken. Paper notes get lost, phone alarms get dismissed and forgotten, and "did grandma take the 8am one?" turns into a guess.

Dose makes that state visible and shared, and turns adherence into something you can actually measure over time instead of something you hope is going well.

## Features

- **Today** — every dose scheduled for the current day, per family member, with one-tap completion
- **Adherence rate** — rolling 30-day compliance, so you can see trends instead of single misses
- **Streaks** — consecutive days without a missed dose, as a nudge toward consistency
- **Medications** — create and manage each medication and its schedule
- **History** — full record of what was taken and when
- **Calendar** — month view of adherence at a glance
- **Dark mode** — system-aware theme switching

## Architecture

Dose is split into two repositories:

| Repo | Role | Stack |
|------|------|-------|
| **Dose-Web** (this repo) | Web client | Next.js 16 (App Router), React 19, TypeScript |
| **Dose-API** | REST API, auth and persistence | NestJS, Prisma |

The web client is a pure consumer of the API — it holds no business logic about scheduling or adherence math. That lives in the API, so the same rules apply no matter what client talks to it.

## Tech stack

**Framework** — Next.js 16 with the App Router, React 19, TypeScript

**Server state** — [TanStack Query](https://tanstack.com/query). Every read from the API goes through it, which gives caching, background revalidation and optimistic updates without hand-rolling loading and error state in each component. Marking a dose as taken updates the UI immediately and reconciles with the server afterwards.

**UI** — Tailwind CSS 4 with [shadcn/ui](https://ui.shadcn.com) and Base UI primitives. Components are owned in-repo rather than imported from a component library, so behaviour stays accessible while the visual layer is fully customizable.

**Motion** — GSAP for screen transitions and the adherence visualizations.

**Feedback** — `sonner` for toasts, `next-themes` for dark mode, `lucide-react` for icons.

**Package manager** — pnpm.

## Running locally

Requires Node.js 20+ and pnpm.

```bash
git clone https://github.com/andre4383/Dose-Web.git
cd Dose-Web
pnpm install
```

Create a `.env.local` in the project root pointing at a running instance of the API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> **Nota para o André:** confirma o nome real da variável no teu código (procura por `process.env.` em `src/`) e a porta em que a Dose-API sobe. Se o nome for outro, corrige aqui — README com variável errada é pior que README sem instrução.

Then start the dev server:

```bash
pnpm dev
```

The app runs on [http://localhost:3001](http://localhost:3001). The API is expected on a separate port.

## Available scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Development server on port 3001 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build on port 3001 |
| `pnpm lint` | Run ESLint |

## Deployment

Deployed continuously on [Vercel](https://vercel.com) from the `master` branch. Set `NEXT_PUBLIC_API_URL` in the project's environment variables to point at the deployed API.

---

## Author

**André Montenegro** 

[GitHub](https://github.com/andre4383) · [LinkedIn](https://www.linkedin.com/in/andré-montenegro-420132391)
