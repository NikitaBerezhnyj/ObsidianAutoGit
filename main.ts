import { Plugin, Notice, FileSystemAdapter } from "obsidian";
import { exec } from "child_process";
import { locales } from "src/locale";
import { CommitModal } from "src/CommitModal";
import { AutoGitSettingTab } from "src/settings";

interface AutoGitSettings {
  token: string;
}

const DEFAULT_SETTINGS: AutoGitSettings = {
  token: ""
};

export default class AutoGit extends Plugin {
  settings: AutoGitSettings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.addSettingTab(new AutoGitSettingTab(this.app, this));

    const supportedLocales = ["en", "uk"] as const;
    type SupportedLocale = (typeof supportedLocales)[number];

    const langRaw = (this.app as any).getLocale?.() || navigator.language || "en";

    const lang: SupportedLocale = supportedLocales.includes(langRaw as SupportedLocale)
      ? (langRaw as SupportedLocale)
      : "en";

    const t = locales[lang];

    console.log(t.pluginLoaded);

    this.addCommand({
      id: "open-commit-modal",
      name: "Open Git Commit Modal",
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "S"
        }
      ],
      callback: async () => {
        const changedFiles = await this.getChangedFiles();
        if (changedFiles.length === 0) {
          new Notice(t.noChangedFiles || "No changed files to commit.");
          return;
        }
        new CommitModal(
          this.app,
          changedFiles,
          message => {
            this.commitAndPush(message);
          },
          t
        ).open();
      }
    });
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // updateRemoteUrlIfNeeded() {
  //   const token = this.settings.token;
  //   if (!token) return;

  //   const adapter = this.app.vault.adapter;
  //   const cwd = adapter.getBasePath();

  //   exec(`git remote set-url origin https://${token}@github.com/USERNAME/REPO.git`, { cwd });
  // }

  gitPull() {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) {
      console.error("Adapter is not FileSystemAdapter");
      return;
    }
    const cwd = adapter.getBasePath();

    exec("git pull", { cwd }, (err, stdout, stderr) => {
      if (stderr.includes("could not read Username")) {
        new Notice("Git авторизація не вдалася. Перевір доступ до репозиторію (SSH або PAT).");
      }
      if (err) {
        console.error("Git pull error:", stderr);
      } else {
        console.log("Git pull success:", stdout);
      }
    });
  }

  getChangedFiles(): Promise<string[]> {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) {
      return Promise.reject("Adapter is not FileSystemAdapter");
    }
    const cwd = adapter.getBasePath();

    return new Promise((resolve, reject) => {
      exec("git status --porcelain", { cwd }, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          const files = stdout
            .split("\n")
            .filter(line => line.trim().length > 0)
            .map(line => line.slice(3));
          resolve(files);
        }
      });
    });
  }

  commitAndPush(message: string) {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) {
      console.error("Adapter is not FileSystemAdapter");
      return;
    }
    const cwd = adapter.getBasePath();

    exec(`git add . && git commit -m "${message}" && git push`, { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error("Git commit/push error:", stderr);
      } else {
        console.log("Git commit/push success:", stdout);
      }
    });
  }
}
