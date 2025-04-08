# Corporate Messenger

A full-stack implementation of a corporate messenger built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Tailwind CSS](https://tailwindcss.com/), and [NextAuth.js](https://next-auth.js.org/). This app offers real-time messaging, server/channel management, and user communication in a secure, scalable way.

## Features

- 🔐 Secure authentication (NextAuth.js)
- 🗂️ Server and channel management
- 💬 Real-time chat with WebSocket (Pusher)
- 📁 File and media sharing
- 🧑‍💼 Role-based access control and admin panel
- 📱 Mobile-first responsive UI
- 🎨 Dark mode and theming support
- 🔔 Notification system
- 🧵 Direct messages and group chats

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Auth:** NextAuth.js
- **Realtime:** Pusher (WebSockets)
- **Deployment:** Vercel / Docker-ready

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/corporate-messenger.git
cd corporate-messenger
```
Install dependencies:

```bash
npm install
```
Set up environment variables: Create a .env file and fill in the necessary values:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
PUSHER_APP_ID=your_pusher_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```
Set up the database:

```bash
npx prisma migrate dev --name init
npm run seed
```
Run the development server:

```bash
npm run dev
```
Project Structure
```
app/ — Pages and layouts using the App Router

components/ — Reusable UI components and modals

api/ — Server-side routes for user, chat, and server logic

lib/ — Helper functions and business logic

hooks/ — Custom React hooks

prisma/ — Schema and seed data

public/ — Static assets

styles/ — Global styles
```

License
MIT
