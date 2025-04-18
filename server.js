const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://ChatAadinDB:chatapp998877@@##@cluster0.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Predefined users
const users = {
  "Sabbir": "Sabbir@123",
  "Safe": "Safe@123",
  "Zisun": "Zisun@123",
  "Zihad": "Zihad@123",
  "Keya": "Keya@123"
};

// Mongoose schema
const msgSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: String
});
const Message = mongoose.model('Message', msgSchema);

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    res.json({ success: true, token: username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Send message
app.post('/sendMessage', async (req, res) => {
  const { token, message } = req.body;
  if (!token || !message) return res.status(400).json({ success: false });
  const time = new Date().toLocaleString('bn-BD', { hour12: true });
  const newMsg = new Message({ sender: token, message, time });
  await newMsg.save();
  res.json({ success: true });
});

// Get all messages
app.get('/getMessages', async (req, res) => {
  const { token } = req.query;
  if (!token || !users[token]) return res.status(401).json({ success: false });
  const msgs = await Message.find({});
  res.json(msgs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
