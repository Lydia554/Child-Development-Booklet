require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); 
const milestoneRoutes = require('./routes/milestoneRoutes');
const childRoutes = require('./routes/childRoutes');
const developmentRoutes = require('./routes/developmentRoutes');  

const app = express();
const port = process.env.PORT || 5000; // ✅ Fix for Heroku

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json()); 

app.use('/api/users', userRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api', childRoutes); 
app.use('/api/child-development', developmentRoutes);  

// ✅ ADD THIS: Default route to prevent 404 error on Heroku
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Heroku!");
});

console.log("MONGO_URI iz .env:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'test', 
})
  .then(() => console.log('Povezivanje sa MongoDB Atlas je uspešno'))
  .catch(err => console.log('❌ Greška pri povezivanju sa MongoDB Atlas:', err));

app.listen(port, () => {
  console.log(`✅ Server je pokrenut na portu ${port}`);
});
