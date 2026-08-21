import { runWebcmd } from "./webcmd_runner.js";

export class BrowserAdapter {
  constructor({ session, url }) {
    if (!session) {
      throw new Error("BrowserAdapter requires a Webcmd session");
    }

    if (!url) {
      throw new Error("BrowserAdapter requires a URL");
    }

    this.session = session;
    this.url = url;
  }

  async run(script) {
    return runWebcmd(
      [
        "--session",
        this.session,
        "browser",
        "run",
        "--stdin",
        "--timeout",
        "30"
      ],
      script
    );
  }

  async inspect() {
    const script = `
const page = await browser.newPage();

await page.goto(${JSON.stringify(this.url)});

const fields = await page.locator(
  "input, textarea, select, button"
).evaluateAll(elements =>
  elements.map((el, index) => ({
    index,
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute("type") || null,
    name: el.getAttribute("name") || null,
    id: el.id || null,
    placeholder: el.getAttribute("placeholder") || null,
    ariaLabel: el.getAttribute("aria-label") || null,
    text: (el.innerText || "").trim(),
    value: el.value ?? "",
    required: el.hasAttribute("required")
  }))
);

console.log(JSON.stringify({
  success: true,
  url: page.url(),
  domain: new URL(page.url()).hostname,
  fields
}));
`;

    try {
      const result = await this.run(script);
      return this.parseResult(result);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async fill(field, value) {
    const script = `
const page = await browser.newPage();

await page.goto(${JSON.stringify(this.url)});

const field = ${JSON.stringify(field)};
const value = ${JSON.stringify(String(value))};

let locator;

if (field.startsWith("#") || field.startsWith(".") || field.includes("[")) {
  locator = page.locator(field);
} else {
  locator = page.locator(
    "#" + field
  );

  if (await locator.count() === 0) {
    locator = page.locator(
      '[name="' + field + '"]'
    );
  }

  if (await locator.count() === 0) {
    locator = page.getByLabel(field);
  }
}

if (await locator.count() === 0) {
  console.log(JSON.stringify({
    success: false,
    field,
    error: "Field not found"
  }));
  process.exit(0);
}

await locator.first().fill(value);

console.log(JSON.stringify({
  success: true,
  field,
  value
}));
`;

    try {
      const result = await this.run(script);
      return this.parseResult(result);
    } catch (error) {
      return {
        success: false,
        field,
        error: error.message
      };
    }
  }

  async action(action) {
    const script = `
const page = await browser.newPage();

await page.goto(${JSON.stringify(this.url)});

const action = ${JSON.stringify(action)};

try {
  if (action.type === "click") {
    let locator;

    if (action.selector) {
      locator = page.locator(action.selector);
    } else if (action.text) {
      locator = page.getByText(action.text, { exact: true });
    } else if (action.role) {
      locator = page.getByRole(
        action.role,
        action.name ? { name: action.name } : {}
      );
    } else {
      throw new Error(
        "Click action requires selector, text, or role"
      );
    }

    if (await locator.count() === 0) {
      throw new Error("Click target not found");
    }

    await locator.first().click();

  } else if (action.type === "navigate") {
    if (!action.url) {
      throw new Error("Navigate action requires url");
    }

    await page.goto(action.url);

  } else if (action.type === "submit") {
    if (action.selector) {
      await page.locator(action.selector).press("Enter");
    } else {
      await page.locator("form").first().press("Enter");
    }

  } else {
    throw new Error(
      "Unsupported action type: " + action.type
    );
  }

  console.log(JSON.stringify({
    success: true,
    action,
    url: page.url(),
    domain: new URL(page.url()).hostname
  }));

} catch (error) {
  console.log(JSON.stringify({
    success: false,
    action,
    error: error.message,
    url: page.url(),
    domain: new URL(page.url()).hostname
  }));
}
`;

    try {
      const result = await this.run(script);
      return this.parseResult(result);
    } catch (error) {
      return {
        success: false,
        action,
        error: error.message
      };
    }
  }

  async currentPage() {
    const script = `
const page = await browser.newPage();

await page.goto(${JSON.stringify(this.url)});

console.log(JSON.stringify({
  success: true,
  url: page.url(),
  domain: new URL(page.url()).hostname
}));
`;

    try {
      const result = await this.run(script);
      return this.parseResult(result);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  parseResult(result) {
    const outer = JSON.parse(result.stdout);

    const log = outer.logs?.find(
      item =>
        item.level === "log" &&
        Array.isArray(item.args) &&
        typeof item.args[0] === "string"
    );

    if (!log) {
      throw new Error("No adapter response returned by Webcmd");
    }

    return JSON.parse(log.args[0]);
  }
}
