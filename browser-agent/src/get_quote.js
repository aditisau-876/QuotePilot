await page.goto("http://localhost:3001");

await page.locator("#product").fill("Laptop");
await page.locator("#quantity").fill("10");
await page.locator("#delivery_location").fill("Delhi");
await page.locator("#delivery_days").fill("7");
await page.locator("#warranty").fill("12");

await page.getByRole("button", { name: "Get Quote" }).click();

await page.waitForTimeout(500);

const body = await page.locator("body").innerText();

console.log(JSON.stringify({
  supplier: "TechSource Supplies",
  product: "Laptop",
  quantity: 10,
  delivery_location: "Delhi",
  requested_delivery_days: 7,
  requested_warranty_months: 12,
  response: body
}, null, 2));