import { runWebcmd } from "./webcmd_runner.js";

function extractDomain(url) {
  try {
    const withoutProtocol = String(url).replace(
      /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//,
      ""
    );

    return withoutProtocol.split("/")[0].split(":")[0];
  } catch {
    return "";
  }
}

export class BrowserAdapter {
  constructor(sessionId) {
    this.sessionId = sessionId;

    if (!this.sessionId) {
      throw new Error(
        "WEBCMD_SESSION is required for BrowserAdapter"
      );
    }
  }

  async run(script) {
    return await runWebcmd(
      [
        "--session",
        this.sessionId,
        "browser",
        "run",
        "--stdin",
        "--timeout",
        "30"
      ],
      script
    );
  }

  async goto(url) {
    const script = `
await page.goto(${JSON.stringify(url)});

const currentUrl = page.url();

console.log(JSON.stringify({
  success: true,
  action: "goto",
  url: currentUrl
}));
`;

    return this.run(script);
  }

  async inspect() {
    const script = `
const currentUrl = page.url();
const bodyText = await page.locator("body").innerText();

const domain = String(currentUrl)
  .replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\\/\\//, "")
  .split("/")[0]
  .split(":")[0];

console.log(JSON.stringify({
  success: true,
  action: "inspect",
  url: currentUrl,
  domain,
  text: bodyText
}));
`;

    return this.run(script);
  }

  async fill(selector, value) {
    const script = `
try {
  await page.locator(${JSON.stringify(selector)}).fill(
    ${JSON.stringify(String(value))}
  );

  console.log(JSON.stringify({
    success: true,
    action: "fill",
    selector: ${JSON.stringify(selector)},
    value: ${JSON.stringify(String(value))},
    url: page.url()
  }));
} catch (error) {
  console.log(JSON.stringify({
    success: false,
    action: "fill",
    selector: ${JSON.stringify(selector)},
    error: error.message,
    url: page.url()
  }));

  process.exitCode = 1;
}
`;

    return this.run(script);
  }

  async click(selector) {
    const script = `
try {
  await page.locator(${JSON.stringify(selector)}).click();

  console.log(JSON.stringify({
    success: true,
    action: "click",
    selector: ${JSON.stringify(selector)},
    url: page.url()
  }));
} catch (error) {
  console.log(JSON.stringify({
    success: false,
    action: "click",
    selector: ${JSON.stringify(selector)},
    error: error.message,
    url: page.url()
  }));

  process.exitCode = 1;
}
`;

    return this.run(script);
  }

  async getPageInfo() {
    const script = `
const currentUrl = page.url();

const domain = String(currentUrl)
  .replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\\/\\//, "")
  .split("/")[0]
  .split(":")[0];

console.log(JSON.stringify({
  success: true,
  url: currentUrl,
  domain,
  title: await page.title()
}));
`;

    return this.run(script);
  }
}