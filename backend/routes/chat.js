const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// API to get the latest 10 messages
router.get('/', async (req, res) => { // Updated to match the route prefix
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 }) // Sort by latest
      .limit(10); // Limit to last 10 messages
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => { // Updated to match the route prefix
  try {
    const messages = await Message.deleteMany()
    res.json("deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to send a message
router.post('/', async (req, res) => {
    const { sender, receiver, message } = req.body;
    console.log('POST request received:', req.body);
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();
      console.log('Message saved:', newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
