const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Milestone = require('../models/milestone');


router.get('/:childId', protect, async (req, res) => {
  try {
    console.log('Fetching milestones for child:', req.params.childId);
    const milestones = await Milestone.find({ childId: req.params.childId }).sort({ milestoneDate: -1 });

    if (!milestones.length) {
      console.log('No milestones found for this child.');
      return res.status(404).json({ message: 'No milestones found' });
    }

    console.log('Milestones found:', milestones);
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ message: 'Error fetching milestone data' });
  }
});


router.get('/single/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json(milestone);
  } catch (error) {
    console.error('Error fetching milestone:', error);
    res.status(500).json({ message: 'Error fetching milestone' });
  }
});


router.post('/:childId', protect, async (req, res) => {
  try {
    console.log('Creating milestone for child:', req.params.childId);
    console.log('Milestone data:', req.body);

    const milestone = new Milestone({
      childId: req.params.childId,
      milestoneType: req.body.milestoneType,  
      milestoneDate: req.body.milestoneDate,  
      progress: req.body.progress,           
      notes: req.body.notes || ''            
    });

    const savedMilestone = await milestone.save();
    res.status(201).json(savedMilestone);
  } catch (error) {
    console.error('Error saving milestone:', error);
    res.status(500).json({ message: 'Error saving milestone' });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      {
        milestoneType: req.body.milestoneType,
        milestoneDate: req.body.milestoneDate,
        progress: req.body.progress,
        notes: req.body.notes
      },
      { new: true } 
    );
    res.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Error updating milestone' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ message: 'Error deleting milestone' });
  }
});

module.exports = router;
