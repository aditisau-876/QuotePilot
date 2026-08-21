import fs from "node:fs/promises";
import path from "node:path";
import { runWebcmd } from "./webcmd_runner.js";

export async function loadSupplier(supplierId) {
  const filePath = path.join(
    process.cwd(),
    "browser-agent",
    "suppliers",
    supplierId,
    "supplier.json"
  );

  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

export async function runSupplier(supplierId, requirements) {
  const supplier = await loadSupplier(supplierId);

  console.log("\n================================");
  console.log(`Supplier: ${supplier.name}`);
  console.log(`URL: ${supplier.url}`);
  console.log("================================");

  const script = `
await page.goto(${JSON.stringify(supplier.url)});

await page.locator("#product").fill(${JSON.stringify(requirements.product)});
await page.locator("#quantity").fill(String(${JSON.stringify(requirements.quantity)}));
await page.locator("#delivery_location").fill(${JSON.stringify(requirements.delivery_location)});
await page.locator("#delivery_days").fill(String(${JSON.stringify(requirements.max_delivery_days)}));
await page.locator("#warranty").fill(String(${JSON.stringify(requirements.min_warranty_years * 12)}));

await page.getByRole("button", { name: "Get Quote" }).click();

await page.waitForTimeout(500);

const response = await page.locator("body").innerText();

console.log(JSON.stringify({
  supplier_id: ${JSON.stringify(supplier.id)},
  supplier: ${JSON.stringify(supplier.name)},
  request: ${JSON.stringify(requirements)},
  response
}, null, 2));
`;

  const result = await runWebcmd([
    "--session",
    process.env.WEBCMD_SESSION,
    "browser",
    "run",
    "--stdin",
    "--timeout",
    "30"
  ], script);

  return {
    supplier_id: supplier.id,
    supplier_name: supplier.name,
    status: "completed",
    result
  };
}
