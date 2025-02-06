const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// MongoDB Atlas connection string
const dbPassword = 'FreeMongoDBVirus123!'; // replace with your password or URL encode it
const dbUri = `mongodb+srv://designx:${dbPassword}@cluster0.gimhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB Atlas
mongoose.connect(dbUri)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });

// Define the User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // Store hashed password
});

// Create a model for User
const User = mongoose.model('User', userSchema);

const app = express();
const PORT = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public'))); // This will serve files from 'public' folder

// Route to serve index.html from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password using bcryptjs with a saltRounds value of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with hashed password
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        // Save the new user to MongoDB
        await newUser.save();
        res.send('<h2>Registration Successful!</h2>');
    } catch (err) {
        console.error('Error saving user data:', err);
        res.send('Error saving user data.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
