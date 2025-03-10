const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const protect = require('../middleware/auth');
const router = express.Router();
const childIdCheck = require('../middleware/childIdCheck');  


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sva polja su obavezna' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Korisnik sa tim email-om već postoji' });
    }

    const user = new User({
      name,
      email,
      password: password, 
    });

    await user.save();

    res.status(201).json({ message: 'Registracija uspešna! Prijavite se za pristup' });
  } catch (error) {
    console.error('Greška pri registraciji:', error);
    res.status(500).json({ message: 'Greška na serveru, pokušajte ponovo' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email i lozinka su obavezni' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Neispravni podaci za prijavu' });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Neispravni podaci za prijavu' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });

  } catch (error) {
    console.error('Greška pri logovanju:', error);
    res.status(500).json({ message: 'Greška na serveru, pokušajte ponovo' });
  }
});


router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ message: `Dobrodošao, ${user.name}`, user });
  } catch (error) {
    console.error('Greška pri dohvaćanju korisničkih podataka:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});


router.use('/child-development', childIdCheck);  

module.exports = router;
