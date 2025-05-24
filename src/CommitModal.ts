import { Modal, App, Setting } from "obsidian";

interface CommitModalOptions {
  changedFiles: string[];
  onSubmit: (message: string) => void;
  locale: {
    commitTitle: string;
    changedFiles: string;
    commitMessage: string;
    save: string;
    cancel: string;
  };
}

export class CommitModal extends Modal {
  changedFiles: string[];
  onSubmit: (message: string) => void;
  locale: CommitModalOptions["locale"];

  constructor(
    app: App,
    changedFiles: string[],
    onSubmit: (message: string) => void,
    locale: CommitModalOptions["locale"]
  ) {
    super(app);
    this.changedFiles = changedFiles;
    this.onSubmit = onSubmit;
    this.locale = locale;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: this.locale.commitTitle });

    contentEl.createEl("p", { text: this.locale.changedFiles });
    const ul = contentEl.createEl("ul");
    this.changedFiles.forEach(file => {
      ul.createEl("li", { text: file });
    });

    let message = "";

    new Setting(contentEl).setName(this.locale.commitMessage).addText(text => {
      text.onChange(value => {
        message = value;
      });
      text.inputEl.style.width = "100%";
    });

    new Setting(contentEl)
      .addButton(btn =>
        btn
          .setButtonText(this.locale.save)
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(message);
          })
      )
      .addButton(btn =>
        btn.setButtonText(this.locale.cancel).onClick(() => {
          this.close();
        })
      );
  }

  onClose() {
    this.contentEl.empty();
  }
}
