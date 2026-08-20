import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TechSource Supplies</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: 50px auto;
          padding: 20px;
        }

        label {
          display: block;
          margin-top: 18px;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-top: 6px;
          box-sizing: border-box;
        }

        button {
          margin-top: 25px;
          padding: 12px 24px;
          cursor: pointer;
        }
      </style>
    </head>

    <body>

      <h1>TechSource Supplies</h1>

      <h2>Request a Quote</h2>

      <form method="POST" action="/quote">

        <label for="product">
          Product
        </label>

        <input
          id="product"
          name="product"
          type="text"
        />

        <label for="quantity">
          Quantity
        </label>

        <input
          id="quantity"
          name="quantity"
          type="number"
        />

        <label for="delivery_location">
          Delivery Location
        </label>

        <input
          id="delivery_location"
          name="delivery_location"
          type="text"
        />

        <label for="delivery_days">
          Required Delivery
        </label>

        <input
          id="delivery_days"
          name="delivery_days"
          type="number"
        />

        <label for="warranty">
          Warranty
        </label>

        <input
          id="warranty"
          name="warranty"
          type="number"
        />

        <button type="submit">
          Get Quote
        </button>

      </form>

    </body>
    </html>
  `);
});

app.post("/quote", (req, res) => {
  const quantity = Number(req.body.quantity || 0);

  const pricePerLaptop = 5200;
  const totalPrice = quantity * pricePerLaptop;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quote Generated</title>
    </head>

    <body>

      <h1>Quote Generated</h1>

      <p>
        Product:
        <strong>${req.body.product}</strong>
      </p>

      <p>
        Quantity:
        <strong>${quantity}</strong>
      </p>

      <p>
        Total Price:
        <strong>₹${totalPrice.toLocaleString("en-IN")}</strong>
      </p>

      <p>
        Delivery:
        <strong>5 days</strong>
      </p>

      <p>
        Warranty:
        <strong>2 years</strong>
      </p>

      <p>
        Quote ID:
        <strong>TS-1024</strong>
      </p>

    </body>
    </html>
  `);
});

app.listen(3001, () => {
  console.log(
    "Supplier A running at http://localhost:3001"
  );
});