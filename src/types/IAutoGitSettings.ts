export interface IAutoGitSettings {
  token: string;
  language: "en" | "uk";
  autoCommitEnabled: boolean;
  autoCommitInterval: number; // minutes
}
