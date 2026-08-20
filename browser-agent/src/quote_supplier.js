const quote = {
  product: "Laptop",
  quantity: 10,
  delivery_location: "Delhi",
  delivery_days: 7,
  warranty: 12
};

await page.goto("http://localhost:3001");

await page.locator("#product").fill(quote.product);
await page.locator("#quantity").fill(String(quote.quantity));
await page.locator("#delivery_location").fill(quote.delivery_location);
await page.locator("#delivery_days").fill(String(quote.delivery_days));
await page.locator("#warranty").fill(String(quote.warranty));

await page.getByRole("button", { name: "Get Quote" }).click();

await page.waitForTimeout(500);

const response = await page.locator("body").innerText();

console.log(JSON.stringify({
  supplier: "TechSource Supplies",
  request: quote,
  response
}, null, 2));