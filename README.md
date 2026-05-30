# GreenCity Web Application — E2E тести

Автоматизовані end-to-end тести для вебдодатка [GreenCity](https://www.greencity.cx.ua/#/greenCity).

Проєкт побудований на Playwright (TypeScript) з використанням патерну Page Object Model, компонентного підходу та звітності через Allure Report.

## Тест-кейси

| ID    | Опис                                                    |
|-------|---------------------------------------------------------|
| TC-01 | Форма створення новини — наявність та порядок полів      |
| TC-02 | Валідація заголовка (обов'язковість, ліміт 170 символів) |
| TC-03 | Вибір тегів (від 1 до 3, четвертий блокується)           |
| TC-04 | Валідація завантаження зображення (PNG/JPG, до 10 МБ)    |
| TC-05 | Валідація основного тексту (20–63 206 символів)           |
| TC-06 | Валідація поля Source (необов'язкове, формат URL)         |
| TC-07 | Модальне вікно підтвердження скасування                  |
| TC-08 | Попередній перегляд новини                                |
| TC-09 | Кнопка редагування видима для автора                      |
| TC-10 | Редагування власної новини зі збереженням дати створення  |

## Стек

- Playwright Test Runner
- TypeScript
- Allure Report (allure-playwright, allure-js-commons)
- GitHub Actions + GitHub Pages

## Структура проєкту

```
src/
  components/     Header, Footer, NewsCard, ConfirmationModal
  pages/          Page Objects (BasePage, AuthPage, NewsPage, CreateNewsPage, ...)
  fixtures/       Розширена фікстура Playwright (авторизація + сторінки)
  utils/          Константи, тестові дані, хелпери
tests/            Специфікації TC-01 ... TC-10
```

## Встановлення та запуск

```bash
git clone https://github.com/CurlyLikee/GreenCity-Web-Application.git
cd GreenCity-Web-Application
npm install
npx playwright install chromium
```

Скопіюйте `.env.example` у `.env` та вкажіть дані верифікованого акаунта GreenCity:

```
GC_USER_EMAIL=your-email@example.com
GC_USER_PASSWORD=YourPassword
GC_USER_NAME=YourName
```

Акаунт має бути зареєстрований на сайті GreenCity з підтвердженим email.

### Запуск тестів

```bash
npm test
npm run test:headed
npm run test:ui
```

### Генерація Allure-звіту

```bash
npm run allure:serve
```

або

```bash
npm run allure:generate
npm run allure:open
```

## CI/CD

У репозиторії налаштований GitHub Actions workflow (`.github/workflows/playwright.yml`), який запускає тести при push та pull request у гілку main, збирає результати та публікує Allure Report на GitHub Pages.

Для роботи в CI додайте секрети репозиторію: `GC_USER_EMAIL`, `GC_USER_PASSWORD`, `GC_USER_NAME`.

## Конфігурація

Базовий URL винесений у `playwright.config.ts`:

```
https://www.greencity.cx.ua/#/greenCity
```

При падінні тесту автоматично зберігається скриншот та trace (`trace: 'retain-on-failure'`).
