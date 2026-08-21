import { runSupplier } from "./supplier_runner.js";

const requirements = {
  product: "Laptop",
  quantity: 100,
  delivery_location: "Kolkata",
  max_delivery_days: 7,
  min_warranty_years: 2
};

async function main() {
  try {
    console.log("======================================");
    console.log("      QUOTEPILOT BROWSER AGENT");
    console.log("======================================");

    console.log("\nRequirements:");
    console.log(requirements);

    const result = await runSupplier(
      "supplier-a",
      requirements
    );

    console.log("\nResult:");
    console.log(result);

  } catch (error) {
    console.error("\n❌ Browser agent failed");
    console.error(error.message);
    process.exit(1);
  }
}

main();