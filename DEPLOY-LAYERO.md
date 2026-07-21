# Деплой Жан Клод Мангал на Layero

Проект работает как Next.js SSR-приложение с API-маршрутом `/api/order`. При оформлении заказа сервер Layero параллельно отправляет заявку на электронную почту и в Telegram.

## 1. Переменные окружения

До production-деплоя добавьте в панели Layero следующие переменные:

```env
NEXT_PUBLIC_SITE_URL=https://zhanklodmangal.ru

SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_TIMEOUT_MS=12000
SMTP_USER=ogannesigityan@yandex.ru
SMTP_PASS=пароль_приложения_яндекс_почты
SMTP_FROM=ogannesigityan@yandex.ru
ORDER_EMAIL=ogannesigityan@yandex.ru

TELEGRAM_BOT_TOKEN=токен_от_BotFather
TELEGRAM_CHAT_ID=id_личного_чата_или_закрытой_группы
TELEGRAM_SILENT=false
TELEGRAM_RELAY_URL=https://2-26-111-48.sslip.io/telegram/order
TELEGRAM_RELAY_SECRET=общий_секретный_ключ
```

`TELEGRAM_PROXY_URL` в Layero не задавайте и удалите её из панели, если она была добавлена: сервер хостинга должен обращаться к Telegram напрямую. Код принудительно игнорирует локальный прокси в production. Эта переменная нужна только для локального запуска из сети, где Telegram доступен через прокси.

Если прямые запросы Layero к Telegram завершаются по таймауту, используйте подготовленный Cloudflare Worker из `C:\Users\admin\Desktop\BOTzakazisite\telegram-relay`. В этом случае сайт отправляет заказы через `TELEGRAM_RELAY_URL`, а `TELEGRAM_RELAY_SECRET` защищает endpoint от посторонних запросов. Токен бота и ID чата хранятся в секретах Worker.

Секреты нельзя добавлять в Git или в переменные с префиксом `NEXT_PUBLIC_`. После изменения переменных окружения создайте новый деплой.

## 2. Telegram для сотрудников

Рекомендуемый вариант — закрытая группа сотрудников:

1. Создайте группу в Telegram.
2. Добавьте в неё бота и сотрудников.
3. Отправьте в группе любое сообщение или команду боту.
4. На текущем компьютере выполните:

   ```powershell
   node --env-file="C:\Users\admin\Desktop\zhanklod\.env.local" "C:\Users\admin\Desktop\BOTzakazisite\TGbot\get-chat-id.mjs"
   ```

5. Скопируйте отрицательный ID группы в `TELEGRAM_CHAT_ID` в Layero.

## 3. Проверка перед деплоем

```powershell
npm ci
npm run typecheck
npm run build
```

## 4. Деплой

Из корня проекта:

```powershell
npx layero deploy
```

Также можно подключить GitHub-репозиторий в Layero и публиковать production из ветки `main`.

## 5. Проверка production

1. Оформите один тестовый заказ с комментарием `ТЕСТ — НЕ ГОТОВИТЬ`.
2. Проверьте письмо и сообщение в Telegram.
3. В ответе `POST /api/order` поле `channels` должно содержать `email` и `telegram`.
4. Если один канал недоступен, заказ считается принятым через второй канал, а ошибка записывается в серверный лог Layero.
