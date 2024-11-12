const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.get('/', async (req, res) => { // Updated to match the route prefix
  try {
    const messages = await Message.find().sort({ timestamp: 1 }) 
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


module.exports = router;
