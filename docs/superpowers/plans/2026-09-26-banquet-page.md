# Banquet Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить `/banquets` в полноценную посадочную страницу с новым первым экраном, доверительными блоками, модальной заявкой на email, отзывами, телефонным CTA и полноширинной картой.

**Architecture:** Статическая страница остаётся серверно отрисованной и собирается из небольших компонентов в `components/banquets`. Клиентский JavaScript изолируется в модальном окне заявки и мобильной карусели; заявка проходит через отдельный тестируемый handler и SMTP-доставку, не затрагивая `/api/order`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Embla через существующий Carousel, Nodemailer, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-26-banquet-page-design.md`

## Global Constraints

- Сохранить текущие Tilda Sans, угольно-коричневую палитру, оранжевый огонь, золотые акценты и кремовый текст.
- Не добавлять новые зависимости, изображения, шрифты, glassmorphism, градиентный текст или декоративные сетки.
- Единственный `h1`: «Организация банкетов, корпоративов и других мероприятий в Самаре».
- Строка условий: «До 40 человек — Стоимость от 2500 ₽ на гостя — Можно со своим алкоголем».
- Вводный абзац: «Мы знаем, как сделать ваш праздник вкусным и уютным. Дни рождения, корпоративы или встречи с друзьями — в «ЖанКлод Мангал» вы получаете тёплую атмосферу, сочное мясо на углях и никакой суеты.»
- Получатель заявки берётся из `ORDER_EMAIL`; в конфигурации проекта это `ogannesigityan@yandex.ru`.
- Банкетная заявка отправляется только по email и не меняет `/api/order` или Telegram-заказы.
- Согласие на обработку персональных данных обязательно; используются действующие `/consent`, `/policy` и версия из `lib/personal-data.ts`.
- Цель доступности — WCAG 2.2 AA; сенсорные цели не меньше 44 × 44 px, есть видимый фокус и reduced-motion режим.
- Поддерживаются ширины 320, 390, 768 и 1280 px без горизонтального переполнения.
- Все продуктовые изменения выполняются по TDD: тест должен упасть по ожидаемой причине до реализации.

## Review Focus

- Телефон с форматированием, пробелами и скобками должен проходить, а строка с менее чем 10 цифрами — возвращать `400`; закрепить в Task 1.
- Шестая заявка с одного IP за 15 минут должна возвращать `429`, не вызывая доставку; закрепить в Task 1.
- SMTP-ошибка не должна раскрывать клиенту адреса, пароль или технический текст; закрепить в Task 1.
- Закрытие модального окна по `Escape` должно вернуть фокус исходной CTA-кнопке и сохранить доступность клавиатуры; закрепить в Task 3.
- На 320 px карусель, hero и карта не должны расширять документ, а отзыв должен быть доступен без свайпа; закрепить в Tasks 4 и 6.

---

## File Structure

**Create**

- `data/banquets.ts` — предоставленные тексты преимуществ и отзывы.
- `lib/banquet-request.ts` — типы, очистка, валидация и форматирование письма без IO.
- `lib/banquet-request-delivery.ts` — Nodemailer и SMTP-доставка.
- `lib/banquet-request-handler.ts` — тестируемая HTTP-логика с внедряемой функцией доставки.
- `app/api/banquet-request/route.ts` — тонкая Next.js-граница.
- `components/banquets/BanquetHero.tsx` — hero, фотокомпозиция и доверительные блоки.
- `components/banquets/BanquetRequestDialog.tsx` — доступная модальная форма и её состояния.
- `components/banquets/BanquetPhoneCta.tsx` — телефонный CTA.
- `components/banquets/BanquetReviews.tsx` — desktop-сетка и мобильная карусель.
- `components/banquets/BanquetContacts.tsx` — контактная панель и карта.
- `tests/e2e/banquet-request-api.spec.ts` — валидация, rate limit, handler и формат письма.
- `tests/e2e/banquet-page.spec.ts` — содержимое страницы, modal, carousel, контакты, SEO и responsive.

**Modify**

- `app/banquets/page.tsx` — новая композиция и metadata.
- `components/BanquetsSection.tsx` — удалить после замены последнего использования.
- `app/globals.css` — только общие стили, которые нельзя выразить локальными Tailwind-классами; предпочтительно не расширять.
- `next.config.ts` — менять только если реальная карта блокируется действующей CSP; ожидается, что изменений не потребуется.

## Task 1: Серверный поток банкетной заявки

**Files:**
- Create: `lib/banquet-request.ts`
- Create: `lib/banquet-request-delivery.ts`
- Create: `lib/banquet-request-handler.ts`
- Create: `app/api/banquet-request/route.ts`
- Create: `tests/e2e/banquet-request-api.spec.ts`

**Interfaces:**
- Produces: `BanquetRequestPayload`, `ValidatedBanquetRequest`, `BanquetRequestValidationError`.
- Produces: `validateBanquetRequestPayload(body: unknown): ValidatedBanquetRequest`.
- Produces: `formatBanquetRequestEmail(request: ValidatedBanquetRequest, date?: Date): string`.
- Produces: `deliverBanquetRequestEmail(request: ValidatedBanquetRequest): Promise<void>`.
- Produces: `createBanquetRequestHandler(deliver: (request: ValidatedBanquetRequest) => Promise<void>): (request: Request) => Promise<Response>`.
- Consumes: `PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE`, `PERSONAL_DATA_CONSENT_VERSION`, `getRequestIp`, `isRateLimited`.

- [ ] **Step 1: Write failing validation and formatter tests**

  Add tests named:
  - `принимает валидную банкетную заявку и очищает пробелы`;
  - `отклоняет имя без текста`;
  - `принимает форматированный телефон с 10 цифрами`;
  - `отклоняет телефон короче 10 цифр`;
  - `отклоняет заявку без согласия`;
  - `обрезает имя до 80, телефон до 40 и комментарий до 1000 символов`;
  - `формирует текстовое письмо с датой Самары и без HTML`.

  Assert exact cleaned fields, `BanquetRequestValidationError` messages and required email lines.

- [ ] **Step 2: Run validation tests and verify RED**

  Run: `npx playwright test tests/e2e/banquet-request-api.spec.ts --grep "валидную|имя|телефон|согласия|обрезает|письмо"`

  Expected: FAIL because `lib/banquet-request.ts` does not exist.

- [ ] **Step 3: Implement pure request validation and formatting**

  Implement the interfaces in `lib/banquet-request.ts`. Use plain-text formatting, `Europe/Samara`, current consent version, and the exact size limits from the spec. Escape user HTML by never generating HTML; include user values only in the `text` body.

- [ ] **Step 4: Run validation tests and verify GREEN**

  Run the Step 2 command. Expected: all selected tests PASS.

- [ ] **Step 5: Write failing handler tests**

  Add tests named:
  - `handler передаёт валидную заявку в доставку и возвращает 200`;
  - `handler возвращает 400 и не вызывает доставку при невалидных данных`;
  - `handler возвращает 429 на шестую заявку одного IP за 15 минут`;
  - `handler возвращает безопасный 500 при ошибке SMTP`.

  Inject a local fake `deliver` function; use a unique `x-forwarded-for` per test. Assert call count, status and exact public response. The `500` body must not contain the thrown SMTP message.

- [ ] **Step 6: Run handler tests and verify RED**

  Run: `npx playwright test tests/e2e/banquet-request-api.spec.ts --grep "handler"`

  Expected: FAIL because handler and route do not exist.

- [ ] **Step 7: Implement handler, SMTP delivery and route**

  `createBanquetRequestHandler` checks rate limit `5` per `15 * 60_000`, parses JSON, validates, awaits injected delivery, and maps validation/rate/delivery failures to `400/429/500`. `deliverBanquetRequestEmail` reuses the current SMTP variable names and sends subject `Новая заявка на банкет с сайта Жан Клод Мангал` to `ORDER_EMAIL`. `route.ts` exports `runtime = "nodejs"` and `POST` from the factory with real delivery.

- [ ] **Step 8: Run API tests and typecheck**

  Run: `npx playwright test tests/e2e/banquet-request-api.spec.ts && npm run typecheck`

  Expected: all API tests PASS; TypeScript exits `0`.

- [ ] **Step 9: Commit Task 1**

  ```powershell
  git add -- lib/banquet-request.ts lib/banquet-request-delivery.ts lib/banquet-request-handler.ts app/api/banquet-request/route.ts tests/e2e/banquet-request-api.spec.ts
  git commit -m "Добавил отправку банкетной заявки"
  ```

## Task 2: Первый экран и блоки доверия

**Files:**
- Create: `data/banquets.ts`
- Create: `components/banquets/BanquetHero.tsx`
- Modify: `app/banquets/page.tsx`
- Test: `tests/e2e/banquet-page.spec.ts`

**Interfaces:**
- Produces: `banquetBenefits` and `banquetReviews` immutable data arrays.
- Produces: `BanquetHero()` server component with trigger attribute `data-banquet-request-open`.
- Consumes: current `banquet-table.webp`, `banquet-hall.webp`, `banquet-food.webp`.

- [ ] **Step 1: Write failing hero tests**

  Test `/banquets` for:
  - one visible level-1 heading with the exact approved title;
  - exact conditions line `До 40 человек — Стоимость от 2500 ₽ на гостя — Можно со своим алкоголем`;
  - exact approved paragraph `Мы знаем, как сделать ваш праздник вкусным и уютным. Дни рождения, корпоративы или встречи с друзьями — в «ЖанКлод Мангал» вы получаете тёплую атмосферу, сочное мясо на углях и никакой суеты.`;
  - a button named `Оставить заявку`;
  - three benefit headings and texts;
  - three banquet images with non-empty `alt`;
  - desktop order: text column precedes image composition in DOM.

- [ ] **Step 2: Run hero test and verify RED**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "первый экран"`

  Expected: FAIL on the old heading and missing benefits.

- [ ] **Step 3: Implement banquet data and `BanquetHero`**

  Use the approved copy verbatim. On `md` and wider use text left and enlarged image composition right; on mobile stack text before images. Preserve the relative three-image composition. Render the three benefits as a semantic list integrated at the bottom of the hero using Lucide icons.

- [ ] **Step 4: Replace old hero in the page**

  Render `BanquetHero` from `app/banquets/page.tsx`; do not add the remaining sections yet.

- [ ] **Step 5: Run hero tests and verify GREEN**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "первый экран"`

  Expected: PASS.

- [ ] **Step 6: Commit Task 2**

  ```powershell
  git add -- data/banquets.ts components/banquets/BanquetHero.tsx app/banquets/page.tsx tests/e2e/banquet-page.spec.ts
  git commit -m "Обновил первый экран банкетной страницы"
  ```

## Task 3: Доступная модальная форма

**Files:**
- Create: `components/banquets/BanquetRequestDialog.tsx`
- Modify: `app/banquets/page.tsx`
- Modify: `tests/e2e/banquet-page.spec.ts`

**Interfaces:**
- Consumes: click on `[data-banquet-request-open]`.
- Consumes: `PERSONAL_DATA_CONSENT_VERSION` for request payload.
- Produces: `BanquetRequestDialog()` client component posting to `/api/banquet-request`.

- [ ] **Step 1: Write failing dialog tests**

  Add tests:
  - `кнопка открывает форму с именем, телефоном, комментарием и согласием`;
  - `Escape закрывает форму и возвращает фокус кнопке`;
  - `не отправляет телефон короче 10 цифр`;
  - `не отправляет форму без согласия`;
  - `показывает успех и очищает форму после ответа 200`;
  - `сохраняет значения и показывает ошибку после ответа 500`.

  Route `/api/banquet-request` in UI tests to return deterministic `200` or `500`; assert the outgoing JSON on success, including consent version.

- [ ] **Step 2: Run dialog tests and verify RED**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "форму|Escape|телефон|согласия|успех|ошибку"`

  Expected: FAIL because no dialog opens.

- [ ] **Step 3: Implement `BanquetRequestDialog`**

  Use native `<dialog>`, remember the exact trigger element, call `showModal()`, use `cancel` for Escape, close on backdrop pointer only, and return focus after close. Validate phone digit count and consent before `fetch`. Expose accessible inline status/error text; keep values on failure and reset only on success.

- [ ] **Step 4: Mount dialog once in the page**

  Render `BanquetRequestDialog` after the main content so all current and future CTA triggers can open it without making the page sections client components.

- [ ] **Step 5: Run dialog tests and verify GREEN**

  Run the Step 2 command. Expected: all selected tests PASS.

- [ ] **Step 6: Commit Task 3**

  ```powershell
  git add -- components/banquets/BanquetRequestDialog.tsx app/banquets/page.tsx tests/e2e/banquet-page.spec.ts
  git commit -m "Добавил форму банкетной заявки"
  ```

## Task 4: Телефонный CTA и отзывы

**Files:**
- Create: `components/banquets/BanquetPhoneCta.tsx`
- Create: `components/banquets/BanquetReviews.tsx`
- Modify: `data/banquets.ts`
- Modify: `app/banquets/page.tsx`
- Modify: `tests/e2e/banquet-page.spec.ts`

**Interfaces:**
- Consumes: `site.orderPhone`, `site.yandexOrgUrl`, `banquetReviews`.
- Produces: server component `BanquetPhoneCta()`.
- Produces: client component `BanquetReviews()` using existing `components/ui/carousel.tsx`.

- [ ] **Step 1: Write failing phone and reviews tests**

  Assert exact phone CTA heading and `tel:+79033086289`. Assert all three exact authors and dates. At 1280 px, assert all three review articles are visible. At 390 px, assert one slide is visible, `Следующий отзыв` changes the visible author, `Предыдущий отзыв` returns it, and the indicator changes.

- [ ] **Step 2: Run section tests and verify RED**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "телефон|отзывы"`

  Expected: FAIL because sections do not exist.

- [ ] **Step 3: Implement phone CTA and review data**

  Add the exact approved heading, phone link, names, dates and lightly corrected review copy from the spec. Do not invent banquet claims or ratings.

- [ ] **Step 4: Implement responsive review presentation**

  Render a `hidden md:grid` three-column desktop list and a `md:hidden` Embla carousel. Provide accessible previous/next labels, live slide position, keyboard controls from the existing carousel, swipe, no autoplay and reduced-motion-safe transitions.

- [ ] **Step 5: Compose sections and verify GREEN**

  Add both sections after the hero, then run the Step 2 command. Expected: PASS.

- [ ] **Step 6: Commit Task 4**

  ```powershell
  git add -- data/banquets.ts components/banquets/BanquetPhoneCta.tsx components/banquets/BanquetReviews.tsx app/banquets/page.tsx tests/e2e/banquet-page.spec.ts
  git commit -m "Добавил отзывы и телефон банкетной страницы"
  ```

## Task 5: Контакты, карта и SEO-композиция

**Files:**
- Create: `components/banquets/BanquetContacts.tsx`
- Modify: `app/banquets/page.tsx`
- Delete: `components/BanquetsSection.tsx`
- Modify: `tests/e2e/banquet-page.spec.ts`

**Interfaces:**
- Consumes: `site.address`, `site.openingHours`, `site.orderPhone`, `site.yandexMapsUrl`.
- Consumes: existing Yandex organization embed and route URLs from `data/reviews.ts`.
- Produces: `BanquetContacts()` server component.

- [ ] **Step 1: Write failing contacts and SEO tests**

  Assert:
  - full-width map iframe with title `Жан Клод Мангал на Яндекс Картах`;
  - phone, address and both opening-hours lines;
  - external route link;
  - page title matching the approved `h1` plus site template;
  - canonical `https://zhanklodmangal.ru/banquets`;
  - robots metadata containing `index`;
  - only one `h1` and expected `h2` section hierarchy.

- [ ] **Step 2: Run contacts and SEO tests and verify RED**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "контакты|SEO"`

  Expected: FAIL because the new contacts section and title do not exist.

- [ ] **Step 3: Implement `BanquetContacts`**

  Use a full-viewport-width section. Place the semantic contact panel over the lower-left map area on desktop and before the map on mobile. Use lazy iframe loading, existing URLs, external-link safety and a 44 px minimum route control.

- [ ] **Step 4: Complete page composition and metadata**

  Compose hero → phone CTA → reviews → contacts, with the dialog mounted once. Set metadata title to the approved `h1`; build description only from the approved conditions and paragraph; keep canonical, Open Graph image and `index, follow`.

- [ ] **Step 5: Remove superseded component and verify GREEN**

  Delete `components/BanquetsSection.tsx` after confirming no imports remain. Run the Step 2 command and `rg -n "BanquetsSection" app components`; expected tests PASS and `rg` returns no matches.

- [ ] **Step 6: Commit Task 5**

  ```powershell
  git add -A -- app/banquets/page.tsx components/banquets components/BanquetsSection.tsx tests/e2e/banquet-page.spec.ts
  git commit -m "Завершил банкетную посадочную страницу"
  ```

## Task 6: Адаптивная, визуальная и полная техническая проверка

**Files:**
- Modify when a defect is found: relevant file from Tasks 1–5
- Modify: `tests/e2e/banquet-page.spec.ts`

**Interfaces:**
- Consumes: completed `/banquets` and `/api/banquet-request`.
- Produces: verified production-ready page; no new public API.

- [ ] **Step 1: Add failing responsive regression checks**

  For viewport widths `320`, `390`, `768`, `1280`, assert `document.documentElement.scrollWidth <= window.innerWidth + 1`. At `320`, assert hero CTA, review navigation, phone and route controls are visible and have bounding boxes at least 44 px high. At `1280`, assert text appears left of the photo composition and the contact panel overlays rather than precedes the map.

- [ ] **Step 2: Run responsive tests and verify RED if a layout defect exists**

  Run: `npx playwright test tests/e2e/banquet-page.spec.ts --grep "адаптив"`

  Expected: tests expose any overflow, ordering or target-size defect; if they pass immediately, perform the visual checks in Step 4 before changing code.

- [ ] **Step 3: Fix only verified responsive defects and rerun tests**

  Apply the smallest layout correction for each reproduced failure. Run the Step 2 command after every fix until PASS.

- [ ] **Step 4: Inspect the real page visually**

  Start the dev server, use Playwright CLI snapshots, and save screenshots under ignored `output/playwright/` at `390 × 844`, `768 × 1024` and `1440 × 1000`. Inspect hero crop, heading wraps, form focus/error/success states, review controls, map panel and full-page rhythm. Record and fix only observable defects.

- [ ] **Step 5: Run complete verification**

  Run sequentially:

  ```powershell
  npm run typecheck
  npm run lint
  npm test
  npm run build
  git diff --check
  ```

  Expected: typecheck exits `0`; ESLint has `0` errors; all Playwright tests pass; build exits `0` and statically generates `/banquets`; diff check has no whitespace errors. Existing warnings inside `.agents/skills` may be reported but are not product-code failures.

- [ ] **Step 6: Review requirements against the spec**

  Confirm every section of `docs/superpowers/specs/2026-09-26-banquet-page-design.md` maps to implemented code and a verification result. Confirm no unrelated home/menu behavior changed.

- [ ] **Step 7: Commit final QA fixes**

  ```powershell
  git add -A -- app components data lib tests
  git commit -m "Проверил адаптивность банкетной страницы"
  ```
