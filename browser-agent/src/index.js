import fs from "node:fs/promises";
import { runSupplier } from "./supplier_runner.js";
import { normalizeQuote } from "./quote_normalizer.js";

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

function extractLoggedQuote(stdout) {
  const outer = JSON.parse(stdout);

  const log = outer.logs?.find(
    item =>
      item.level === "log" &&
      Array.isArray(item.args) &&
      typeof item.args[0] === "string" &&
      item.args[0].includes('"response"')
  );

  if (!log) {
    throw new Error("Quote response not found in Webcmd output");
  }

  return JSON.parse(log.args[0]);
}

function isValidQuote(quote, requirements) {
  return (
    quote.product === requirements.product &&
    quote.quantity === requirements.quantity &&
    quote.delivery_days <= requirements.max_delivery_days &&
    quote.warranty_years >= requirements.min_warranty_years &&
    quote.price > 0
  );
}

function selectBestQuote(quotes) {
  return [...quotes].sort((a, b) => {
    if (a.price !== b.price) {
      return a.price - b.price;
    }

    if (a.delivery_days !== b.delivery_days) {
      return a.delivery_days - b.delivery_days;
    }

    return b.warranty_years - a.warranty_years;
  })[0];
}

async function main() {
  console.log("======================================");
  console.log("      QUOTEPILOT BROWSER AGENT");
  console.log("======================================");

  const requirements = await loadRequest();

  console.log("\nRequirements:");
  console.log(requirements);

  const validQuotes = [];
  const results = [];

  for (const supplierId of suppliers) {
    try {
      const result = await runSupplier(
        supplierId,
        requirements
      );

      results.push(result);

      const parsed = extractLoggedQuote(
        result.result.stdout
      );

      const quote = normalizeQuote(parsed);

      if (isValidQuote(quote, requirements)) {
        validQuotes.push(quote);
      } else {
        console.log(
          `Quote rejected: ${quote.supplier}`
        );
      }

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
  console.log("             VALID QUOTES");
  console.log("======================================");

  console.log(
    JSON.stringify(validQuotes, null, 2)
  );

  if (validQuotes.length === 0) {
    console.log("\nNo valid supplier quotes found.");
    process.exitCode = 1;
    return;
  }

  const bestQuote = selectBestQuote(validQuotes);

  console.log("\n======================================");
  console.log("           BEST QUOTE");
  console.log("======================================");

  console.log(
    JSON.stringify(bestQuote, null, 2)
  );

  console.log("\n======================================");
  console.log("        QUOTEPILOT DECISION");
  console.log("======================================");

  console.log(
    `Recommended Supplier: ${bestQuote.supplier}`
  );
  console.log(
    `Total Price: ?${bestQuote.price.toLocaleString("en-IN")}`
  );
  console.log(
    `Delivery: ${bestQuote.delivery_days} days`
  );
  console.log(
    `Warranty: ${bestQuote.warranty_years} years`
  );
  console.log(
    `Quote ID: ${bestQuote.quote_id}`
  );
}

main().catch(error => {
  console.error("\nFatal error:", error);
  process.exit(1);
});
