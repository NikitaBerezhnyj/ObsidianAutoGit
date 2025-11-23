import { App, PluginSettingTab, Setting } from "obsidian";
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
      .setName("GitHub Token")
      .setDesc("Enter your Personal Access Token (PAT). Required for HTTPS push.")
      .addText(text =>
        text
          .setPlaceholder("ghp_XXXXXXXX...")
          .setValue(this.plugin.settings.token)
          .onChange(async value => {
            this.plugin.settings.token = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
