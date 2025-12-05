# Obsidian Auto Git

Repository has [english :uk:](#obsidian-auto-git-uk) and [ukrainian :ukraine:](#obsidian-auto-git-ukraine) localization.

## Obsidian Auto Git :uk:

Obsidian Auto Git is a plugin for Obsidian that automates interactions with a Git repository, keeping your notes up to date across all your devices. The plugin automatically performs a **pull on startup** and a **push at a defined interval**, eliminating the need to manually manage synchronization.

### Overview

The goal of this project is to make using Obsidian in a multi-device environment convenient and reliable while minimizing the risk of data loss and conflicts.
The plugin works on top of Git and integrates with your Vault repository to ensure continuous synchronization of changes.

### Features

- 🔄 **Auto Pull on Start** — automatically fetch changes when Obsidian starts.
- ⏱️ **Scheduled Auto Push** — automatically push changes at a specified interval.
- 🔧 **Configurable Settings** — adjust push interval, notifications, and more.
- 📦 **Written in TypeScript** — modern, readable code leveraging the Obsidian API.

### Technologies Used

- TypeScript
- Node.js / npm
- Obsidian Plugin API
- Git (CLI)

### Getting Started

To get started with Obsidian Auto Git, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/NikitaBerezhnyj/OsidianAutoGit.git
   cd OsidianAutoGit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Copy the generated plugin to your directory:

   ```
   <vault>/.obsidian/plugins/ObsidianAutoGit
   ```

5. Enable the plugin in Obsidian settings.

### Usage

Once the project is running, you can:

1. Configure the automatic push interval in the plugin settings.
2. View Git status in the status bar (if this feature is enabled).
3. Use Obsidian as usual — the plugin will keep the repository up to date automatically.
4. Customize commit behavior, logging, and other parameters if needed.

### License & Community Guidelines

- [License](LICENSE) — project license.
- [Code of Conduct](CODE_OF_CONDUCT.md) — expected behavior for contributors.
- [Contributing Guide](CONTRIBUTING.md) — how to help the project.
- [Security Policy](SECURITY.md) — reporting security issues.

---

## Obsidian Auto Git :ukraine:

Obsidian Auto Git — це плагін для Obsidian, що автоматизує роботу з Git-репозиторієм, забезпечуючи актуальність нотаток на всіх пристроях. Плагін автоматично виконує **pull під час запуску** та **push з певним інтервалом**, що позбавляє необхідності вручну керувати синхронізацією.

### Огляд

Мета проєкту — зробити використання Obsidian у багатопристроєвому середовищі зручним і надійним, мінімізувавши ризик втрати даних та конфліктів.
Плагін працює поверх Git та інтегрується з репозиторієм Vault’у, щоб забезпечити безперервну синхронізацію змін.

### Особливості

- 🔄 **Auto Pull on Start** — автоматичне отримання змін при запуску Obsidian.
- ⏱️ **Scheduled Auto Push** — автоматична відправка змін кожен встановлений інтервал.
- 🔧 **Configurable Settings** — можливість налаштувати інтервал push, повідомлення та інше.
- 📦 **Written in TypeScript** — сучасний, читабельний код з використанням API Obsidian.

### Використані технології

- TypeScript
- Node.js / npm
- Obsidian Plugin API
- Git (CLI)

### Початок роботи

Щоб розпочати роботу з Obsidian Auto Git, виконайте такі кроки:

1. Клонуйте репозиторій:

   ```bash
   git clone https://github.com/NikitaBerezhnyj/OsidianAutoGit.git
   cd OsidianAutoGit
   ```

2. Встановіть залежності:

   ```bash
   npm install
   ```

3. Зберіть проєкт:

   ```bash
   npm run build
   ```

4. Скопіюйте згенерований плагін до вашої директорії:

   ```
   <vault>/.obsidian/plugins/ObsidianAutoGit
   ```

5. Активуйте плагін у налаштуваннях Obsidian.

### Використання

Після запуску проекту ви можете:

1. Налаштувати інтервал автоматичного push у параметрах плагіна.
2. Переглядати статус Git у статус-барі (якщо функціонал увімкнений).
3. Використовувати Obsidian як зазвичай — плагін самостійно підтримуватиме актуальність репозиторію.
4. Змінити спосіб коміту, логування та інші параметри при потребі.

### Ліцензія та правила спільноти

- [License](LICENSE) — ліцензія проєкту.
- [Code of Conduct](CODE_OF_CONDUCT.md) — очікувана поведінка учасників.
- [Contributing Guide](CONTRIBUTING.md) — як допомогти проекту.
- [Security Policy](SECURITY.md) — повідомлення про проблеми безпеки.
