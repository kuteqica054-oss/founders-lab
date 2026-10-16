# Founders Lab — сайт студии прототипирования (Boston, MA)

Статический сайт на **Astro 5 + Tailwind CSS 4**. Сайт **только на английском**, все страницы лежат в корне (`/services/`, `/process/` …). Все иллюстрации, иконки, favicon и OG-картинки сделаны кодом: внешних картинок нет.

> Всё, что ещё не заполнено, на сайте видно как жёлтая плашка **TODO**. Полный список: `npm run todo` или файл [`TODO.md`](./TODO.md).

---

## Быстрый старт

```bash
nvm use            # Node 22 (см. .nvmrc)
npm install
npm run dev        # http://localhost:4321
npm run build      # статическая сборка в dist/ (вместе с OG-картинками и иконками)
npm run preview    # посмотреть собранную версию
npm run check      # проверка типов
npm run todo       # список всех TODO
```

## Страницы

| URL | Страница |
|---|---|
| `/` | Главная |
| `/services/` | Услуги (якоря `#design`, `#3d-printing`, `#laser`, `#packaging`, `#graphics`) |
| `/process/` | Процесс |
| `/equipment/` | Оборудование и материалы |
| `/examples/` | Примеры (сценарии и реальные проекты) |
| `/pricing/` | Как формируется цена |
| `/about/` | О студии |
| `/contact/` | Контакты и бриф |
| `/privacy/`, `/terms/` | Privacy Policy и Terms of Use (черновики) |
| `/thanks/` | «Спасибо» после отправки формы без JS (noindex) |

## Деплой на Hostinger (GitHub Actions → SSH)

При каждом push в `main` GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт и заливает `dist/` на хостинг через SSH (rsync, без удаления чужих файлов). В конце делает проверку живого сайта.

Один раз в репозитории на GitHub → **Settings → Secrets and variables → Actions**:

| Тип | Имя | Значение |
|---|---|---|
| Secret | `FOUNDERS_SSH_HOST` | IP сервера |
| Secret | `FOUNDERS_SSH_PORT` | порт SSH (у Hostinger обычно 65002) |
| Secret | `FOUNDERS_SSH_USER` | SSH-пользователь (u…) |
| Secret | `FOUNDERS_SSH_PASSWORD` | SSH-пароль |
| Variable | `SITE_URL` | `https://ваш-домен` (без слэша в конце) |
| Variable (необяз.) | `FOUNDERS_DEPLOY_PATH` | по умолчанию `domains/<домен>/public_html` |

Запуск вручную: вкладка **Actions → Deploy to Hostinger → Run workflow**.
`public/.htaccess` включает HTTPS, убирает `www`, добавляет слэш в конце адресов, кэширование и страницу 404.

Netlify и Vercel тоже поддерживаются (`netlify.toml`, `vercel.json`), но тогда форму нужно переключить на `netlify` или `formspree`.

## Форма-бриф

Компонент: `src/components/BriefForm.astro`. Настройки: `site.config.mjs → form`.

| Провайдер | Как работает |
|---|---|
| **`php`** (по умолчанию, для Hostinger) | Форма отправляется на `/brief.php`; он собирается из `src/pages/brief.php.ts`. Обработчик присылает заявку с вложенными файлами на `contact.email`, а ответить клиенту можно кнопкой «Ответить». Пока `contact.email` пуст, форма показывает сообщение «not connected yet». |
| `netlify` | Netlify Forms. |
| `formspree` | `formspreeId: 'xxxxabcd'`; файлы только на платном тарифе. |

Без JS форма отправляется обычным POST и открывает `/thanks/`; с JS «спасибо» показывается на странице. Есть honeypot от спама, проверка полей, типа и размера файлов (по умолчанию до 8 МБ). Письма уходят от `noreply@ваш-домен`. Чтобы они не попадали в спам, создайте этот ящик или включите SPF/DKIM в почте Hostinger.

## Сменить название бренда

Одна переменная, `BRAND_NAME`, в `site.config.mjs`. Из неё берутся вордмарк, все `<title>`, OG-картинки, schema.org, юридические тексты и иконки (`brand.monogram`, по умолчанию это инициалы). Последнее слово названия выводится моноширинным «тегом» в рамке: `Founders [Lab]`.

## Цвета и шрифты

Все дизайн-токены собраны в `src/styles/global.css`, в блоке `@theme`:

| Токен | Назначение |
|---|---|
| `--color-paper`, `--color-paper-deep`, `--color-sheet` | бумага чертежа, полосы, карточки |
| `--color-ink`, `--color-ink-2`, `--color-ink-3` | графит: основной, вторичный и третичный текст |
| `--color-grid`, `--color-grid-strong` | сетка миллиметровки |
| `--color-filament` / `--color-filament-ink` | сигнальный оранжевый: декоративный и для мелкого текста (контраст AA) |
| `--color-blueprint`, `--color-blueprint-deep`, `--color-blueprint-line` | синий цвет чертежа |
| `--color-sticky` | стикеры и TODO |

Цвета для OG-картинок и иконок продублированы в `src/lib/og.ts` (объект `C`).
Шрифты: **Bricolage Grotesque** (заголовки), **IBM Plex Sans** (текст), **IBM Plex Mono** (технические подписи), подключены через `@fontsource`, подмножество latin. Для OG-картинок используются TTF-файлы из `src/assets/og-fonts/`.

## Тексты

| Что | Где |
|---|---|
| Все тексты страниц, meta title/description, FAQ, форма, ошибки | `src/i18n/en.ts` |
| Privacy Policy / Terms of Use (черновики) | `src/i18n/legal.ts` |
| URL страниц | `src/i18n/routes.ts` |
| Контакты, адрес (Boston, MA), соцсети (Instagram, LinkedIn, X), юрлицо | `site.config.mjs` |

Мини-разметка внутри строк:
- `**жирный**`;
- `[[текст ссылки]](pricing)` — ссылка на страницу по ключу из `routes.ts`;
- `[[TODO: заметка]]` — видимая жёлтая плашка TODO.

Компоненты по-прежнему принимают проп `lang` (сейчас всегда `'en'`), чтобы при необходимости можно было добавить второй язык, не переписывая вёрстку.

## «Примеры»: сценарии и реальные проекты

Контент-коллекция: `src/content/examples/en/*.md`, схема описана в `src/content.config.ts`.

Добавить реальный проект:
1. Положите фото в `src/assets/photos/` (рекомендуемый размер 1600 × 1200 px, JPG или WebP).
2. Создайте файл `src/content/examples/en/project-name.md`:
   ```yaml
   ---
   ref: my-project
   kind: project            # 'scenario' даёт плашку «Example scenario»
   order: 1
   featured: true           # показывать на главной (первые 3)
   title: …
   summary: …
   illustration: none
   services: [design, 3d-printing]
   input: …
   iterations:
     - { v: v1, note: … }
   result: …
   cover: ../../../assets/photos/my-project.jpg
   coverAlt: …
   client: …                # по желанию
   year: 2026               # по желанию
   ---
   ```
3. Реальные проекты на странице «Примеры» выводятся первыми. Когда портфолио наберётся, сценарии можно удалить или поставить им `featured: false`.

## Фото

Компонент `src/components/PhotoSlot.astro` — это место под будущую фотографию. Сейчас там пунктирная рамка с пометкой, **какое фото и какого размера** нужно положить:

| Где | Что снять | Размер |
|---|---|---|
| Services, у каждой услуги | эскизы и 3D-модель на экране; принтер в работе (макро слоёв); макро гравировки; коробка с ложементом; продукт с этикеткой | 1600 × 1200 |
| Equipment | общий план мастерской; принтеры в работе; макро гравировки; готовые образцы | 2400 × 1600 и 1600 × 1200 |
| About | команда за верстаком (вертикальное фото) | 1600 × 2000 |

Использование: `import shot from '../assets/photos/workshop.jpg'` → `<PhotoSlot src={shot} alt="…" note="…" />`. Astro сам сделает оптимизированные адаптивные версии.
Видимость плейсхолдеров задаётся в `site.config.mjs → photoPlaceholders`: `'always'`, `'dev'` (только в режиме разработки) или `'never'`.

## SEO

- Отдельные `title` и `description` для каждой страницы (`meta` в `en.ts`), canonical, Open Graph (`en_US`), Twitter card.
- OG-картинки 1200 × 630 для каждой страницы: SVG-шаблон из `src/lib/og.ts` → PNG через resvg при сборке, путь `/og/{page}.png`.
- schema.org: `Organization + LocalBusiness` с адресом Boston, MA (улица и ZIP добавятся, когда заполните их в конфиге), `FAQPage` на главной, `ItemList` услуг, `BreadcrumbList`.
- `/sitemap.xml` и `/robots.txt` генерируются из `routes.ts`.
- Favicon: `/favicon.svg`, `/favicon-32.png`, `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `site.webmanifest`.

## Анимации и доступность

- Прорисовка линий (`.d` + `pathLength="1"`), путь лазера (`offset-path`), послойная печать (CSS `steps`) и появление блоков при скролле. Всё сделано на CSS, плюс маленький IntersectionObserver.
- При `prefers-reduced-motion` анимации выключаются и показывается финальное состояние. Без JS контент виден сразу.
- JS используется только для формы, мобильного меню и появления при скролле. Аккордеон FAQ сделан на нативном `<details>`.
- Есть skip-link, видимый фокус, `label` у всех полей, `aria-invalid` с текстом ошибки и сводка ошибок для скринридеров.

## Структура

```
site.config.mjs            бренд, контакты, соцсети, юрлицо, форма
src/i18n/                  тексты (en), юр. тексты, маршруты
src/views/                 страницы
src/pages/                 тонкие маршруты + эндпоинты OG/иконок/sitemap/robots
src/components/            секции и UI
src/components/illustrations/  SVG-иллюстрации в стиле чертежа
src/lib/                   геометрия иллюстраций, форматирование, schema.org, OG-рендер
src/content/examples/      сценарии и проекты (Markdown)
```
