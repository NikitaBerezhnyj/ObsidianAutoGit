import { Plugin, Notice } from "obsidian";
import {
  getRepoPath,
  getChangedFiles,
  commitAndPush,
  gitPull,
  gitPush,
  execGit
} from "src/utils/git";
import { minutesToMs } from "src/utils/time";
import { locales } from "src/utils/locale";
import { CommitModal } from "src/CommitModal";
import { AutoGitSettingTab } from "src/settings";
import { IAutoGitSettings } from "src/types/IAutoGitSettings";
import { DEFAULT_SETTINGS } from "src/constants/constants";

export default class AutoGit extends Plugin {
  settings: IAutoGitSettings;
  autoCommitIntervalId: NodeJS.Timeout | null = null;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new AutoGitSettingTab(this.app, this));

    const t = this.getLocaleStrings();
    const cwd = getRepoPath(this.app);

    if (cwd) {
      await gitPull(cwd, this.settings.token);
    }

    this.addCommand({
      id: "open-commit-modal",
      name: t.commandCommitModal,
      hotkeys: [
        {
          modifiers: ["Ctrl", "Shift"],
          key: "s"
        }
      ],
      callback: async () => {
        if (!cwd) {
          new Notice("Cannot find git repository");
          return;
        }

        const changed = await getChangedFiles(cwd);

        if (!changed.length) {
          new Notice(t.noChangedFiles);
          return;
        }

        new CommitModal(
          this.app,
          changed,
          msg => commitAndPush(msg, cwd, this.settings.token),
          t
        ).open();
      }
    });

    this.addCommand({
      id: "manual-pull",
      name: t.commandPull,
      callback: async () => {
        if (!cwd) {
          new Notice("Cannot find git repository");
          return;
        }

        new Notice("Pulling from remote...");
        await gitPull(cwd, this.settings.token);
      }
    });

    this.addCommand({
      id: "manual-push",
      name: t.commandPush,
      callback: async () => {
        if (!cwd) {
          new Notice("Cannot find git repository");
          return;
        }

        const { stdout } = await execGit("git status -sb", cwd);

        if (stdout.includes("ahead 0")) {
          new Notice("Nothing to push");
          return;
        }

        new Notice("Pushing to remote...");
        await gitPush(cwd, this.settings.token);
      }
    });

    this.setupAutoCommit();
  }

  setupAutoCommit() {
    if (this.autoCommitIntervalId) {
      clearInterval(this.autoCommitIntervalId);
      this.autoCommitIntervalId = null;
    }

    if (!this.settings.autoCommitEnabled) return;

    const intervalMs = minutesToMs(this.settings.autoCommitInterval);
    const t = this.getLocaleStrings();
    const cwd = getRepoPath(this.app);

    if (!cwd) {
      new Notice("Cannot find git repository for auto-commit");
      return;
    }

    this.autoCommitIntervalId = setInterval(async () => {
      const changed = await getChangedFiles(cwd);

      if (!changed.length) {
        console.log("[AutoGit] No changes to commit");
        return;
      }

      console.log("[AutoGit] Auto-committing changes...");
      await commitAndPush(t.autoMessage, cwd, this.settings.token);
    }, intervalMs);

    console.log(
      `[AutoGit] Auto-commit enabled with ${this.settings.autoCommitInterval} minute interval`
    );
  }

  getLocaleStrings() {
    return locales[this.settings.language] || locales.en;
  }

  onunload() {
    if (this.autoCommitIntervalId) {
      clearInterval(this.autoCommitIntervalId);
      this.autoCommitIntervalId = null;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.setupAutoCommit();
  }

  async resetSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    await this.saveSettings();
  }
}
