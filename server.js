const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Helper to read/write simple JSON files in Backend folder
const DATA_DIR = path.join(__dirname);
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function readJSON(file){
  try{ return JSON.parse(fs.readFileSync(file,'utf8')||'[]'); }catch(e){ return []; }
}
function writeJSON(file, data){
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Ensure files exist
if(!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);
if(!fs.existsSync(ORDERS_FILE)) writeJSON(ORDERS_FILE, []);

// Serve frontend static files from project root (one level up)
app.use(express.static(path.join(__dirname, '..')));

// Simple routes
app.get('/api/ping', (req,res) => res.json({ok:true, time: Date.now()}));

// Signup
app.post('/api/signup', (req,res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'username and password required'});
  const users = readJSON(USERS_FILE);
  if(users.find(u=>u.username===username)) return res.status(409).json({error:'user exists'});
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: uuidv4(), username, password: hash, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);
  res.json({ok:true, user:{id:user.id, username:user.username}});
});

// Login
app.post('/api/login', (req,res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'username and password required'});
  const users = readJSON(USERS_FILE);
  const user = users.find(u=>u.username===username);
  if(!user) return res.status(401).json({error:'invalid credentials'});
  const match = bcrypt.compareSync(password, user.password);
  if(!match) return res.status(401).json({error:'invalid credentials'});
  // Very simple token (not secure) — for demo only
  const token = uuidv4();
  // store token briefly on user (in file) — demo only
  user.token = token;
  writeJSON(USERS_FILE, users);
  res.json({ok:true, token, user:{id:user.id, username:user.username}});
});

// Get menu (static sample)
app.get('/api/menu', (req,res) => {
  const menu = [
    { id: 'pizza', name: 'Delicious Pizza', price: 1000 },
    { id: 'burger', name: 'Double Decker Burger', price: 450 },
    { id: 'white-pasta', name: 'White Sauce Pasta', price: 600 },
    { id: 'loaded-fries', name: 'Loaded fries', price: 500 },
    { id: 'broast', name: 'Broast', price: 1800 },
    { id: 'plain-pasta', name: 'Plain Pasta', price: 700 },
    { id: 'burrito', name: 'Burrito', price: 1000 },
    { id: 'bbq', name: 'BBQ', price: 1500 }
  ];
  res.json(menu);
});

// Create order
app.post('/api/order', (req,res) => {
  const { items, customer } = req.body; // items: [{id, name, price, qty}], customer: {name, phone, address}
  if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({error:'items required'});
  const orders = readJSON(ORDERS_FILE);
  const order = { id: uuidv4(), items, customer: customer||{}, createdAt: new Date().toISOString(), status: 'new' };
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);
  res.json({ok:true, order});
});

// List orders
app.get('/api/orders', (req,res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

app.listen(PORT, ()=> console.log(`TastyBites backend listening on http://localhost:${PORT}`));
