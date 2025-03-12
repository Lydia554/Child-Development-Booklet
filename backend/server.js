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
const port = process.env.PORT || 5000; 
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json()); 

app.use('/api/users', userRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api', childRoutes); 
app.use('/api/child-development', developmentRoutes);  


app.get("/", (req, res) => {
  res.send("✅ Backend is running on Fly.io!");
});


if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables!");
  process.exit(1);
}


console.log("🔄 Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'ChildTracker' 
})
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); 
  });

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
