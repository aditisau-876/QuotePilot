export function normalizeQuote(parsed) {
  if (!parsed || typeof parsed.response !== "string") {
    throw new Error("Quote response missing");
  }

  const response = parsed.response;

  const product = response.match(/Product:\s*(.+)/i)?.[1]?.trim();
  const quantity = response.match(/Quantity:\s*([\d,]+)/i)?.[1];
  const priceMatch = response.match(/Total Price:\s*[^0-9]*([\d,]+)/i);
  const delivery = response.match(/Delivery:\s*(\d+)\s*days?/i);
  const warranty = response.match(/Warranty:\s*(\d+)\s*years?/i);
  const quoteId = response.match(/Quote ID:\s*([A-Za-z0-9-]+)/i);

  if (
    !product ||
    !quantity ||
    !priceMatch ||
    !delivery ||
    !warranty ||
    !quoteId
  ) {
    throw new Error("Could not parse complete quote");
  }

  return {
    supplier: parsed.supplier,
    product,
    quantity: Number(quantity.replace(/,/g, "")),
    price: Number(priceMatch[1].replace(/,/g, "")),
    delivery_days: Number(delivery[1]),
    warranty_years: Number(warranty[1]),
    quote_id: quoteId[1]
  };
}
