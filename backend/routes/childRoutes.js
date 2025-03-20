const express = require('express');
const Child = require('../models/Child');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { name, birthDate, developmentStage } = req.body;
  const parent = req.user.id;

  const newChild = new Child({
    name,
    birthDate,
    developmentStage,
    parent,
  });

  try {
    await newChild.save();
    res.status(201).json(newChild);
  } catch (error) {
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error while adding child:', error);
    }
    res.status(500).json({ message: 'Error while adding child' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Fetching children for user:', req.user.id);
    }

    const children = await Child.find({ parent: req.user.id });

    if (!children.length) {
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("No children found for user:", req.user.id);
      }
      return res.json([]);
    }

    
    if (process.env.NODE_ENV !== 'production') {
      console.log("Children fetched successfully:", children);
    }
    res.json(children);
  } catch (error) {
    
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error fetching children:", error);
    }
    res.status(500).json({ message: "Error fetching children", error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
   
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Fetching child with ID: ${req.params.id}`);
    }

    const child = await Child.findOne({ _id: req.params.id, parent: req.user.id });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json(child);
  } catch (error) {
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching child:', error);
    }
    res.status(500).json({ message: 'Error fetching child', error: error.message });
  }
});

module.exports = router;
