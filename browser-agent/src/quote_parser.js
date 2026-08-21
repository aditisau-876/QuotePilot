export function parseQuote(rawQuote) {
  if (!rawQuote) {
    throw new Error("No quote data received");
  }

  return {
    supplier: rawQuote.supplier ?? null,
    product: rawQuote.product ?? null,
    quantity: Number(rawQuote.quantity ?? 0),
    price: Number(rawQuote.price ?? 0),
    delivery_days: Number(rawQuote.delivery_days ?? 0),
    warranty_years: Number(rawQuote.warranty_years ?? 0),
    quote_id: rawQuote.quote_id ?? null
  };
}