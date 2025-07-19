// Clock: Keep the clock running at the top
setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}, 1000);

// AI Suggestion Functionality
function getSuggestion() {
  const mood = document.getElementById("mood").value.toLowerCase();
  const output = document.getElementById("suggestionOutput");
  const spinner = document.getElementById("spinner");

  spinner.style.display = "inline";
  output.textContent = "";

  setTimeout(() => {
    let suggestion = "";

    if (mood.includes("sweet") || mood.includes("dessert") || mood.includes("sugar"))
      suggestion = "How about Ras Malai, Gulab Jamun, or Jalebi?";
    else if (mood.includes("spicy") || mood.includes("chatpata") || mood.includes("masala"))
      suggestion = "Chilly Momos, Pav Bhaji, or Spicy Noodles would be perfect!";
    else if (mood.includes("tired") || mood.includes("sleepy") || mood.includes("exhausted"))
      suggestion = "Try a strong Coffee, refreshing Tea, or an Energy Drink!";
    else if (mood.includes("cold") || mood.includes("winter") || mood.includes("rainy"))
      suggestion = "Hot Tea, Maggi, or Hot Chocolate is great for this weather.";
    else if (mood.includes("hot") || mood.includes("sunny") || mood.includes("summer"))
      suggestion = "Cold Coffee, Ice Cream, or Fresh Lime Soda to cool off!";
    else if (mood.includes("crunchy") || mood.includes("crispy"))
      suggestion = "Burger and French Fries or Nachos with Cheese!";
    else if (mood.includes("romantic") || mood.includes("date") || mood.includes("love"))
      suggestion = "Hot Chocolate and a warm Paneer Roll or a Slice of Cake!";
    else if (mood.includes("light") || mood.includes("healthy") || mood.includes("diet"))
      suggestion = "Steam Momos, Fresh Salad, or Sprouts!";
    else if (mood.includes("hungry"))
      suggestion = "How about a loaded Veg Sandwich, Chole Bhature, or Pizza?";
    else if (mood.includes("happy"))
      suggestion = "Great! Celebrate with Ice Cream, Brownie Sundae, or Paneer Tikka!";
    else if (mood.includes("angry"))
      suggestion = "Cool down with a chilled Cold Coffee or munch on crunchy Fries!";
    else if (mood.includes("bored"))
      suggestion = "Try something fun like Masala Fries, Pani Puri, or a unique Milkshake!";
    else if (mood.includes("party") || mood.includes("friends") || mood.includes("fun"))
      suggestion = "Try our Special Party Combo: Pizza, Coke & Fries!";
    else if (mood.includes("breakfast"))
      suggestion = "Aloo Paratha, Idli-Sambar or Poha for a perfect start!";
    else if (mood.includes("lunch"))
      suggestion = "Rajma Chawal, Paneer Curry or Veg Thali!";
    else if (mood.includes("dinner"))
      suggestion = "Light Khichdi, Dal-Roti, or a Paneer Roll!";
    else
      suggestion = `Sorry, no specific match found for "${mood}". Here's our Special Tea and Samosa!`;

    spinner.style.display = "none";
    output.textContent = "AI Suggestion: " + suggestion;
  }, 800);
}

// Generate Bill with Customer Details and LocalStorage for History
function generateBill() {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;

  if (!name || !phone) {
    alert("Please fill in all customer details (Name, Phone).");
    return;
  }

  const selected = document.querySelectorAll('input[type="checkbox"]:checked');
  const location = document.getElementById("locationInput").value.trim();
  let text = `Customer Details:\nName: ${name}\nPhone: ${phone}\n\nItems:\n`, total = 0, items = [];

  selected.forEach(item => {
    const itemName = item.dataset.name;
    const price = parseInt(item.value);
    text += `${itemName}: ₹${price}\n`;
    total += price;
    items.push(itemName);
  });

  text += `\nTotal: ₹${total}`;
  text += `\nLocation: ${location || "Not provided"}`;
  document.getElementById("billOutput").textContent = selected.length ? text : "No items selected.";

  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({ time: new Date().toLocaleString(), items, total, location: location || "Not provided" });
  localStorage.setItem("history", JSON.stringify(history));
// ✅ Send to backend
fetch('http://localhost:3000/save-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name,
    phone,
    location: location || "Not provided",
    items,
    total
  })
})
.then(res => res.text())
.then(msg => console.log("Backend:", msg))
.catch(err => console.error("Backend not responding:", err));

  document.getElementById("thankYouMessage").textContent = "Thank you for your order!";

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// Reset/Clear Form Functionality
function resetForm() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("locationInput").value = "";
  document.getElementById("mood").value = "";
  document.getElementById("suggestionOutput").textContent = "";
  document.getElementById("billOutput").textContent = "No items selected.";
  document.getElementById("thankYouMessage").textContent = "";
}

// Show Order History from localStorage
function showHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const list = document.getElementById("orderHistory");
  list.innerHTML = history.length === 0 ? "<li>No orders yet.</li>" : "";
  history.reverse().forEach(order => {
    const li = document.createElement("li");
    li.textContent = `${order.time}: ${order.items.join(", ")} (₹${order.total}) Location: ${order.location}`;
    list.appendChild(li);
  });
}

// Clear Order History from localStorage
function clearHistory() {
  localStorage.removeItem("history");
  showHistory();
}

// Show Locations from past orders
function showPopularLocations() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const locationCount = {};
  history.forEach(order => {
    const loc = order.location || "Unknown";
    locationCount[loc] = (locationCount[loc] || 0) + 1;
  });

  const sorted = Object.entries(locationCount).sort((a, b) => b[1] - a[1]);
  const summaryList = document.getElementById("locationSummary");
  summaryList.innerHTML = sorted.length === 0 ? "<li>No locations found.</li>" : "";

  sorted.forEach(([loc, count]) => {
    const li = document.createElement("li");
    li.textContent = `${loc} - ${count} orders`;
    summaryList.appendChild(li);
  });
}

// Show admin password input field
function showPasswordField() {
  document.getElementById("adminPasswordSection").style.display = "block";
}

// Verify admin password and show admin sections
function verifyAdminPassword() {
  const password = document.getElementById("adminPassword").value;

  if (password === "admin123") {
    document.querySelector(".history-section").style.display = "block";
    document.querySelector(".location-section").style.display = "block";
    document.getElementById("lockAdminBtn").style.display = "inline-block";
    showHistory();
    showPopularLocations();
    alert("Admin View Unlocked.");
  } else {
    alert("Incorrect password!");
  }

  document.getElementById("adminPassword").value = "";
  document.getElementById("adminPasswordSection").style.display = "none";
}

// 🔒 Logout Admin - Hide admin sections and reset
function lockAdmin() {
  document.querySelector(".history-section").style.display = "none";
  document.querySelector(".location-section").style.display = "none";
  document.getElementById("adminPasswordSection").style.display = "none";
  document.getElementById("lockAdminBtn").style.display = "none";

  alert("Admin logged out.");
}



