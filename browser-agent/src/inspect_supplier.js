console.log(await page.locator("input, select, button").evaluateAll(els => els.map(e => ({tag:e.tagName, type:e.type, name:e.name, id:e.id, placeholder:e.placeholder, text:e.innerText}))));
