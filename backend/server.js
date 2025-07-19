const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("✅ Welcome to Rock Cafe Backend!");
});

app.post('/save-order', (req, res) => {
  const { name, phone, location, items, total } = req.body;
  const order = `Time: ${new Date().toLocaleString()}
Name: ${name}
Phone: ${phone}
Location: ${location}
Items: ${items.join(', ')}
Total: ₹${total}
------------------------\n`;

  fs.appendFile('orders.txt', order, err => {
    if (err) {
      console.error("❌ Failed to save order:", err);
      res.status(500).send("Failed to save order.");
    } else {
      console.log("✅ Order saved.");
      res.send("Order saved!");
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
