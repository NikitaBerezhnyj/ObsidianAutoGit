import { Modal, App, Setting } from "obsidian";
import { ICommitModalOptions } from "./types/ICommitModalOptions";

export class CommitModal extends Modal {
  changedFiles: string[];
  onSubmit: (message: string) => void;
  locale: ICommitModalOptions["locale"];
  messageInput = "";

  constructor(
    app: App,
    changedFiles: string[],
    onSubmit: (message: string) => void,
    locale: ICommitModalOptions["locale"]
  ) {
    super(app);
    this.changedFiles = changedFiles;
    this.onSubmit = onSubmit;
    this.locale = locale;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: this.locale.commitTitle });

    contentEl.createEl("p", {
      text: `${this.locale.changedFiles} (${this.changedFiles.length})`
    });

    const ul = contentEl.createEl("ul");
    ul.style.maxHeight = "200px";
    ul.style.overflowY = "auto";
    ul.style.marginBottom = "1em";

    this.changedFiles.forEach(file => {
      ul.createEl("li", { text: file });
    });

    new Setting(contentEl).setName(this.locale.commitMessage).addText(text => {
      text.inputEl.style.width = "100%";
      text.onChange(value => {
        this.messageInput = value;
      });

      setTimeout(() => text.inputEl.focus(), 100);

      text.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      });
    });

    new Setting(contentEl)
      .addButton(btn =>
        btn
          .setButtonText(this.locale.save)
          .setCta()
          .onClick(() => {
            this.handleSubmit();
          })
      )
      .addButton(btn =>
        btn.setButtonText(this.locale.cancel).onClick(() => {
          this.close();
        })
      );
  }

  handleSubmit() {
    if (!this.messageInput.trim()) {
      this.messageInput = `Update ${this.changedFiles.length} file(s)`;
    }

    this.close();
    this.onSubmit(this.messageInput);
  }

  onClose() {
    this.contentEl.empty();
  }
}
