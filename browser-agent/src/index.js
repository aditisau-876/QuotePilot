import fs from "node:fs/promises";
import { BrowserAdapter } from "./browser_adapter.js";
import { runSupplier } from "./supplier_runner.js";

const suppliers = [
  "supplier-a",
  "supplier-b",
  "supplier-c"
];

async function loadRequest() {
  const data = await fs.readFile(
    new URL("../request.json", import.meta.url),
    "utf8"
  );

  return JSON.parse(data);
}

async function main() {
  console.log("======================================");
  console.log("      QUOTEPILOT BROWSER AGENT");
  console.log("======================================");

  if (!process.env.WEBCMD_SESSION) {
    throw new Error(
      "WEBCMD_SESSION environment variable is not set"
    );
  }

  const requirements = await loadRequest();

  console.log("\nRequirements:");
  console.log(requirements);

  /*
   * One BrowserAdapter is created for the entire run.
   * This gives Person 2's intelligence layer a single
   * browser session/page interface.
   */
  const browser = new BrowserAdapter(
    process.env.WEBCMD_SESSION
  );

  const results = [];

  for (const supplierId of suppliers) {
    try {
      const result = await runSupplier(
        supplierId,
        requirements,
        browser
      );

      results.push(result);

    } catch (error) {
      console.error(
        `Supplier ${supplierId} failed:`,
        error.message
      );

      results.push({
        supplier_id: supplierId,
        status: "failed",
        error: error.message
      });
    }
  }

  console.log("\n======================================");
  console.log("             ALL RESULTS");
  console.log("======================================");

  console.log(
    JSON.stringify(results, null, 2)
  );
}

main().catch((error) => {
  console.error("\nFatal error:", error);
  process.exit(1);
});
