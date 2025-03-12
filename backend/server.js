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


const allowedOrigins = [
  'https://child-development-frontend.fly.dev', 
  'http://localhost:8080', 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Nije dozvoljeno od strane CORS-a'));
    }
  },
  credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(bodyParser.json()); 
app.use(express.json()); 

app.use('/api/users', userRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api', childRoutes); 
app.use('/api/child-development', developmentRoutes);  

app.get("/", (req, res) => {
  res.send("✅ Backend radi na Fly.io!");
});

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI nije definisan u promenljivama okruženja!");
  process.exit(1);
}

console.log("🔄 Povezivanje sa MongoDB...");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'ChildTracker' 
})
  .then(() => console.log('✅ Uspešno povezivanje sa MongoDB Atlasom'))
  .catch(err => {
    console.error('❌ Greška pri povezivanju sa MongoDB:', err);
    process.exit(1); 
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${port}`);
  });
  