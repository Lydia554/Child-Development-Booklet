const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const ChildDevelopment = require('../models/childDevelopmentModel');

router.get('/:childId', protect, async (req, res) => {
  try {
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Fetching development for child:', req.params.childId);
    }

    const development = await ChildDevelopment.findOne({ childId: req.params.childId });

   
    if (process.env.NODE_ENV !== 'production') {
      console.log('Found development:', development);
    }

    res.json(development ? development.periods : []);
  } catch (error) {
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching development:', error);
    }
    res.status(500).json({ message: 'Error fetching development data' });
  }
});

router.post('/:childId', protect, async (req, res) => {
  try {
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saving development for child:', req.params.childId);
      console.log('Development data:', req.body);
    }

    const periodData = {
      startAge: parseInt(req.body.startAge),
      endAge: parseInt(req.body.endAge),
      physicalDevelopment: req.body.physicalDevelopment,
      emotionalDevelopment: req.body.emotionalDevelopment,
      intellectualDevelopment: req.body.intellectualDevelopment,
      socialDevelopment: req.body.socialDevelopment
    };

    let childDevelopment = await ChildDevelopment.findOne({ 
      childId: req.params.childId 
    });

    if (!childDevelopment) {
      childDevelopment = new ChildDevelopment({
        childId: req.params.childId,
        periods: []
      });
    }

    const existingPeriodIndex = childDevelopment.periods.findIndex(p => 
      p.startAge === periodData.startAge && p.endAge === periodData.endAge
    );

    if (existingPeriodIndex !== -1) {
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Updating existing period');
      }

      childDevelopment.periods[existingPeriodIndex] = periodData;
    } else {
     
      if (process.env.NODE_ENV !== 'production') {
        console.log('Adding new period');
      }

      childDevelopment.periods.push(periodData);
    }

    const savedDevelopment = await childDevelopment.save();

  
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved development:', savedDevelopment);
    }

    res.status(201).json(savedDevelopment);
  } catch (error) {
   
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error saving development:', error);
    }
    res.status(500).json({ message: 'Error saving development data', error: error.message });
  }
});

router.delete('/:childId/:developmentId', protect, async (req, res) => {
  try {
    const { childId, developmentId } = req.params;
    

    if (process.env.NODE_ENV !== 'production') {
      console.log('Deleting development for child:', childId);
      console.log('Development ID to delete:', developmentId);
    }

    const childDevelopment = await ChildDevelopment.findOne({ childId: childId });

    if (!childDevelopment) {
      return res.status(404).json({ message: 'Development data not found for this child.' });
    }

    const periodIndex = childDevelopment.periods.findIndex(p => p._id.toString() === developmentId);

    if (periodIndex === -1) {
      return res.status(404).json({ message: 'Development period not found.' });
    }

    childDevelopment.periods.splice(periodIndex, 1); 
    await childDevelopment.save();  

    res.status(200).json({ message: 'Development period deleted successfully' });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error deleting development:', error);
    }
    res.status(500).json({ message: 'Error deleting development data' });
  }
});

module.exports = router;
