import { spawn } from "node:child_process";

export function runWebcmd(args = []) {
  return new Promise((resolve, reject) => {
    console.log("\n[Webcmd] Starting...");
    console.log("[Webcmd] Arguments:", args);

    const command = process.platform === "win32"
      ? "webcmd.cmd"
      : "webcmd";

    const child = spawn(command, args, {
      shell: false,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("error", (error) => {
      reject(
        new Error(`Could not start Webcmd: ${error.message}`)
      );
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({
          success: true,
          stdout,
          stderr
        });
      } else {
        reject(
          new Error(
            `Webcmd exited with code ${code}\n${stderr}`
          )
        );
      }
    });
  });
}