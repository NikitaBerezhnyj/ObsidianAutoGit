import { exec } from "child_process";
import { FileSystemAdapter, Notice, App } from "obsidian";

export function getRepoPath(app: App): string | null {
  const adapter = app.vault.adapter;

  if (!(adapter instanceof FileSystemAdapter)) {
    console.error("[AutoGit] Vault adapter is not FileSystemAdapter.");
    return null;
  }

  return adapter.getBasePath();
}

export function execGit(
  command: string,
  cwd: string
): Promise<{ stdout: string; stderr: string; success: boolean }> {
  return new Promise(resolve => {
    exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[AutoGit] Git error running '${command}':`, stderr);
        resolve({ stdout, stderr, success: false });
      } else {
        resolve({ stdout, stderr, success: true });
      }
    });
  });
}

export async function gitPull(cwd: string, token?: string) {
  console.log("[AutoGit] Pulling from remote...");

  const { stderr, success } = await execGit("git pull", cwd);

  if (!success) {
    if (stderr.includes("could not read Username") || stderr.includes("Authentication failed")) {
      new Notice("Git authentication failed. Check SSH keys or Personal Access Token in settings.");
    } else if (stderr.includes("fatal")) {
      new Notice("Git pull failed. Check console for details.");
      console.error("[AutoGit] Pull fatal error:", stderr);
    } else {
      new Notice("Git pull completed with warnings. Check console.");
    }
  } else {
    console.log("[AutoGit] Pull successful");
  }
}

export async function gitPush(cwd: string, token?: string) {
  console.log("[AutoGit] Pushing to remote...");

  let pushSuccess = false;
  let pushStderr = "";

  if (token && token.trim().length > 0) {
    const { stdout: remoteUrl, success: remoteSuccess } = await execGit(
      "git remote get-url origin",
      cwd
    );

    if (remoteSuccess && remoteUrl.trim().startsWith("https://")) {
      let cleanUrl = remoteUrl.trim().split("\n")[0];

      cleanUrl = cleanUrl.replace(/https:\/\/[^@]*@/, "https://");

      if (cleanUrl.endsWith(".git")) {
        cleanUrl = cleanUrl.slice(0, -4);
      }

      const urlWithToken = cleanUrl.replace("https://", `https://${token}@`);

      const result = await execGit(`git push ${urlWithToken}`, cwd);
      pushSuccess = result.success;
      pushStderr = result.stderr;
    } else {
      const result = await execGit("git push", cwd);
      pushSuccess = result.success;
      pushStderr = result.stderr;
    }
  } else {
    const result = await execGit("git push", cwd);
    pushSuccess = result.success;
    pushStderr = result.stderr;
  }

  if (!pushSuccess) {
    if (pushStderr.includes("Authentication failed") || pushStderr.includes("could not read")) {
      new Notice("Push failed: Authentication error. Check your token in settings.");
    } else if (pushStderr.includes("403")) {
      new Notice("Push failed: Access denied. Make sure your token has 'repo' scope.");
      console.error("[AutoGit] Token may not have correct permissions.");
    } else if (pushStderr.includes("fatal") || pushStderr.includes("error")) {
      new Notice("Git push failed. Check console for details.");
      console.error("[AutoGit] Push error:", pushStderr);
    }
  } else {
    new Notice("✓ Pushed successfully");
    console.log("[AutoGit] Push successful");
  }
}

export async function getChangedFiles(cwd: string): Promise<string[]> {
  const { stdout, success } = await execGit("git status --porcelain", cwd);

  if (!success) {
    console.error("[AutoGit] Failed to get changed files");
    return [];
  }

  return stdout
    .split("\n")
    .filter(line => line.trim().length > 0)
    .map(line => line.slice(3));
}

export async function commitAndPush(message: string, cwd: string, token?: string) {
  console.log(`[AutoGit] Committing with message: "${message}"`);

  const changed = await getChangedFiles(cwd);
  if (!changed.length) {
    new Notice("No changes to commit");
    return;
  }

  const { success: addSuccess } = await execGit("git add .", cwd);
  if (!addSuccess) {
    new Notice("Git add failed. Check console for details.");
    return;
  }

  const { success: commitSuccess, stderr: commitStderr } = await execGit(
    `git commit -m "${message.replace(/"/g, '\\"')}"`,
    cwd
  );

  if (!commitSuccess) {
    if (commitStderr.includes("nothing to commit")) {
      console.log("[AutoGit] Nothing to commit");
      return;
    }
    new Notice("Git commit failed. Check console for details.");
    return;
  }

  let pushSuccess = false;
  let pushStderr = "";

  if (token && token.trim().length > 0) {
    const { stdout: remoteUrl, success: remoteSuccess } = await execGit(
      "git remote get-url origin",
      cwd
    );

    if (remoteSuccess && remoteUrl.trim().startsWith("https://")) {
      let cleanUrl = remoteUrl.trim().split("\n")[0];

      cleanUrl = cleanUrl.replace(/https:\/\/[^@]*@/, "https://");

      if (cleanUrl.endsWith(".git")) {
        cleanUrl = cleanUrl.slice(0, -4);
      }

      const urlWithToken = cleanUrl.replace("https://", `https://${token}@`);

      const result = await execGit(`git push ${urlWithToken} HEAD:main`, cwd);
      pushSuccess = result.success;
      pushStderr = result.stderr;

      if (!pushSuccess && pushStderr.includes("src refspec HEAD does not match any")) {
        const result2 = await execGit(`git push ${urlWithToken} HEAD:master`, cwd);
        pushSuccess = result2.success;
        pushStderr = result2.stderr;
      }
    } else {
      const result = await execGit("git push", cwd);
      pushSuccess = result.success;
      pushStderr = result.stderr;
    }
  } else {
    const result = await execGit("git push", cwd);
    pushSuccess = result.success;
    pushStderr = result.stderr;
  }

  if (!pushSuccess) {
    if (pushStderr.includes("Authentication failed") || pushStderr.includes("could not read")) {
      new Notice("Push failed: Authentication error. Check your token in settings.");
    } else if (pushStderr.includes("403")) {
      new Notice("Push failed: Access denied. Make sure your token has 'repo' scope.");
      console.error(
        "[AutoGit] Token may not have correct permissions. Go to github.com/settings/tokens and ensure 'repo' scope is checked."
      );
    } else if (pushStderr.includes("fatal") || pushStderr.includes("error")) {
      new Notice("Git push failed. Check console for details.");
      console.error("[AutoGit] Push error:", pushStderr);
    }
  } else {
    new Notice("✓ Changes committed and pushed successfully");
    console.log("[AutoGit] Commit and push successful");
  }
}
