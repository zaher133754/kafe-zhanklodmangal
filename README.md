# ЖанКлод Мангал — Next.js migration

Перенос Tilda-страницы на Next.js 15, React, TypeScript и Tailwind CSS без Tilda-зависимостей.

## Запуск

```bash
npm install
npm run prepare:assets
npm run dev
```

## Формы

Форма заказа отправляет `POST /api/order`. Для Telegram укажите `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Для почты укажите SMTP-переменные из `.env.example`.

## SEO

App Router генерирует metadata, Open Graph, canonical, `sitemap.xml`, `robots.txt` и JSON-LD `Restaurant`/`LocalBusiness`. Домен задаётся через `NEXT_PUBLIC_SITE_URL`.
