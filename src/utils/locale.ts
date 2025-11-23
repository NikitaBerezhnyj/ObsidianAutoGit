import { ILocaleStrings } from "src/types/ILocaleStrings";

export const locales: Record<"en" | "uk", ILocaleStrings> = {
  en: {
    commitTitle: "Commit Changes",
    changedFiles: "Changed files:",
    commitMessage: "Commit message",
    save: "Commit & Push",
    cancel: "Cancel",
    gitAuthError: "Git authorization failed. Check SSH or token.",
    noChangedFiles: "No changes to commit",
    pluginLoaded: "AutoGit plugin loaded",
    commandCommitModal: "Open commit modal",
    commandPull: "Pull from remote",
    commandPush: "Push to remote",
    autoMessage: "Auto-commit: vault backup"
  },
  uk: {
    commitTitle: "Зберегти зміни",
    changedFiles: "Змінені файли:",
    commitMessage: "Повідомлення commit",
    save: "Зберегти і відправити",
    cancel: "Скасувати",
    gitAuthError: "Помилка авторизації Git. Перевірте SSH або токен.",
    noChangedFiles: "Немає змін для збереження",
    pluginLoaded: "Плагін AutoGit завантажено",
    commandCommitModal: "Відкрити вікно commit",
    commandPull: "Отримати зміни з віддаленого репозиторію",
    commandPush: "Відправити зміни на віддалений репозиторій",
    autoMessage: "Авто-commit: резервна копія сховища"
  }
};
