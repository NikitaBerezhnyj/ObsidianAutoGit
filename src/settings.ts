import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import AutoGit from "../main";

export class AutoGitSettingTab extends PluginSettingTab {
  plugin: AutoGit;

  constructor(app: App, plugin: AutoGit) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "AutoGit Settings" });

    new Setting(containerEl)
      .setName("GitHub Personal Access Token")
      .setDesc(
        "For HTTPS push authentication. Create token at: github.com/settings/tokens (needs 'repo' scope)"
      )
      .addText(text =>
        text
          .setPlaceholder("ghp_XXXX...")
          .setValue(this.plugin.settings.token)
          .onChange(async value => {
            this.plugin.settings.token = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Language")
      .setDesc("UI language for AutoGit messages and commands")
      .addDropdown(drop =>
        drop
          .addOption("en", "English")
          .addOption("uk", "Українська")
          .setValue(this.plugin.settings.language)
          .onChange(async value => {
            this.plugin.settings.language = value as "en" | "uk";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable Auto-Commit")
      .setDesc("Automatically commit and push changes at regular intervals")
      .addToggle(toggle =>
        toggle.setValue(this.plugin.settings.autoCommitEnabled).onChange(async value => {
          this.plugin.settings.autoCommitEnabled = value;
          await this.plugin.saveSettings();

          if (value) {
            new Notice(
              `Auto-commit enabled: every ${this.plugin.settings.autoCommitInterval} minutes`
            );
          } else {
            new Notice("Auto-commit disabled");
          }
        })
      );

    new Setting(containerEl)
      .setName("Auto-Commit Interval")
      .setDesc("How often to automatically commit and push (in minutes, minimum 1)")
      .addText(text =>
        text
          .setPlaceholder("5")
          .setValue(String(this.plugin.settings.autoCommitInterval))
          .onChange(async value => {
            const num = parseInt(value, 10);

            if (isNaN(num) || num < 1) {
              new Notice("Interval must be a number >= 1 minute");
              return;
            }

            if (num > 1440) {
              new Notice("Warning: Interval is more than 24 hours");
            }

            this.plugin.settings.autoCommitInterval = num;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Reset to Default")
      .setDesc("Restore all settings to their default values")
      .addButton(btn =>
        btn
          .setButtonText("Reset")
          .setWarning()
          .onClick(async () => {
            await this.plugin.resetSettings();
            this.display();
            new Notice("Settings reset to defaults");
          })
      );

    containerEl.createEl("hr");
    containerEl.createEl("h3", { text: "Usage Tips" });

    const tips = containerEl.createEl("ul");
    tips.createEl("li", {
      text: "Set up SSH keys or use Personal Access Token for authentication"
    });
    tips.createEl("li", { text: "Use Ctrl/Cmd+P and search 'AutoGit' to manually commit" });
    tips.createEl("li", { text: "Auto-commit will only run if there are changes to commit" });
  }
}
