require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Uvoz CORS-a
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); 
const milestoneRoutes = require('./routes/milestoneRoutes');
const childRoutes = require('./routes/childRoutes');
const developmentRoutes = require('./routes/developmentRoutes');  

const app = express();
const port = process.env.PORT || 5000; 

// CORS konfiguracija
const allowedOrigins = [
  'https://child-development-frontend.fly.dev', // Dozvolite vaš frontend domen
  'http://localhost:8080', // Dozvolite vaš lokalni razvojni domen ako je potrebno
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Nije dozvoljeno od strane CORS-a'));
    }
  },
  credentials: true, // Dozvolite kolačiće ili autorizacione zaglavlja
};

// Primena CORS middleware sa specifičnim opcijama
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

app.listen(port, () => {
  console.log(`✅ Server je pokrenut na portu ${port}`);
});
