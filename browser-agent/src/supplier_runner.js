import fs from "node:fs/promises";
import path from "node:path";
import { runWebcmd } from "./webcmd_runner.js";

export async function loadSupplier(supplierId) {
  const filePath = path.join(
    process.cwd(),
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

  /*
   * IMPORTANT:
   *
   * We do not hard-code a fake Webcmd subcommand here.
   * The exact browser command/workflow syntax should come
   * from the installed Webcmd version and its current docs.
   *
   * Once `webcmd --help` and the browser workflow are verified,
   * we will put the exact arguments here.
   */

  return {
    supplier_id: supplier.id,
    supplier_name: supplier.name,
    status: "ready",
    requirements
  };
}