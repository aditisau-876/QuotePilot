import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head><title>GlobalTech Traders</title></head>
    <body>
      <h1>GlobalTech Traders</h1>
      <h2>Request a Quote</h2>
      <form method="POST" action="/quote">
        <label>Product</label>
        <input id="product" name="product" type="text">

        <label>Quantity</label>
        <input id="quantity" name="quantity" type="number">

        <label>Delivery Location</label>
        <input id="delivery_location" name="delivery_location" type="text">

        <label>Required Delivery</label>
        <input id="delivery_days" name="delivery_days" type="number">

        <label>Warranty</label>
        <input id="warranty" name="warranty" type="number">

        <button type="submit">Get Quote</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/quote", (req, res) => {
  const quantity = Number(req.body.quantity || 0);
  const totalPrice = quantity * 4950;

  res.send(`
    <html>
    <head><title>Quote Generated</title></head>
    <body>
      <h1>Quote Generated</h1>
      <p>Product: <strong>${req.body.product}</strong></p>
      <p>Quantity: <strong>${quantity}</strong></p>
      <p>Total Price: <strong>₹${totalPrice.toLocaleString("en-IN")}</strong></p>
      <p>Delivery: <strong>6 days</strong></p>
      <p>Warranty: <strong>3 years</strong></p>
      <p>Quote ID: <strong>GT-2048</strong></p>
    </body>
    </html>
  `);
});

app.listen(3002, () => {
  console.log("Supplier B running at http://localhost:3002");
});
