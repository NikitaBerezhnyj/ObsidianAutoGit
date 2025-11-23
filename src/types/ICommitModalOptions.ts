export interface ICommitModalOptions {
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
