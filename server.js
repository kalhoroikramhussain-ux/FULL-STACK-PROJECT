const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// === FRONTEND ko BACKEND se combine karne wali line ===
// public folder ki HTML/CSS/JS files isi server se chalengi
app.use(express.static("public"));

let users = [];
let nextId = 1;

// ============================================
// RESTRICTIONS / VALIDATIONS
// Galat data aaye to yahi function rok dega
// ============================================
function validateUser(req, res, next) {
  let { username, contactNumber, address } = req.body;

  // 1. Koi field khaali na ho
  if (!username || !contactNumber || !address) {
    return res.status(400).json({ success: false, message: "All fields are required: username, contactNumber, address" });
  }

  username = String(username).trim();
  contactNumber = String(contactNumber).trim();
  address = String(address).trim();

  // 2. USERNAME: sirf letters aur space, 3 se 30 characters
  //    Number ya @ # $ jaisi cheez allow nahi
  if (!/^[A-Za-z ]+$/.test(username)) {
    return res.status(400).json({ success: false, message: "Username mein sirf letters (A-Z, a-z) aur space allowed hai, number ya special character nahi" });
  }
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ success: false, message: "Username 3 se 30 characters ke darmiyan hona chahiye" });
  }

  // 3. CONTACT NUMBER: sirf numbers, bilkul 11 digits, 03 se shuru
  //    Number ki jaga letters ya kuch aur bilkul allow nahi
  if (!/^[0-9]+$/.test(contactNumber)) {
    return res.status(400).json({ success: false, message: "Contact number mein sirf numbers allowed hain, letters ya special character nahi" });
  }
  if (!/^03[0-9]{9}$/.test(contactNumber)) {
    return res.status(400).json({ success: false, message: "Contact number 11 digits ka hona chahiye aur 03 se shuru ho (masalan 03001234567)" });
  }

  // 4. ADDRESS: 5 se 100 characters
  if (address.length < 5 || address.length > 100) {
    return res.status(400).json({ success: false, message: "Address 5 se 100 characters ke darmiyan hona chahiye" });
  }

  // Saaf (trimmed) values aage bhej do
  req.body = { username, contactNumber, address };
  next();
}

// 5. DUPLICATE RESTRICTION: ek contact number se do users nahi ban sakte
function checkDuplicate(req, res, next) {
  const existing = users.find(
    (u) => u.contactNumber === req.body.contactNumber && u.id !== parseInt(req.params.id)
  );
  if (existing) {
    return res.status(400).json({ success: false, message: "Ye contact number pehle se kisi user ke paas hai, duplicate allow nahi" });
  }
  next();
}

// POST - Create User
app.post("/api/users", validateUser, checkDuplicate, (req, res) => {
  const { username, contactNumber, address } = req.body;
  const newUser = { id: nextId++, username, contactNumber, address };
  users.push(newUser);
  res.status(201).json({ success: true, message: "User created successfully", data: newUser });
});

// GET - All Users + Single User
app.get("/api/users", (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, data: user });
});

// PUT - Update User (same restrictions jo POST par hain)
app.put("/api/users/:id", validateUser, checkDuplicate, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  const { username, contactNumber, address } = req.body;
  user.username = username;
  user.contactNumber = contactNumber;
  user.address = address;
  res.status(200).json({ success: true, message: "User updated successfully", data: user });
});

// DELETE - Delete User
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "User not found" });
  const deletedUser = users.splice(index, 1)[0];
  res.status(200).json({ success: true, message: "User deleted successfully", data: deletedUser });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Frontend kholo: http://localhost:${PORT}`);
});
