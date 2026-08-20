await page.locator("#product").fill("Laptop");
await page.locator("#quantity").fill("10");
await page.locator("#delivery_location").fill("Delhi");
await page.locator("#delivery_days").fill("7");
await page.locator("#warranty").fill("12");

await page.getByRole("button", { name: "Get Quote" }).click();

await page.waitForTimeout(500);

console.log("TITLE:", await page.title());
console.log("URL:", page.url());
console.log("BODY:", await page.locator("body").innerText());