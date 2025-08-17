require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/User'); // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HackCulprit_website';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);

        // --- FIX 1: Check by email, which is unique ---
        const existingAdmin = await User.findOne({ email: 'hackculprit@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return mongoose.disconnect(); // Disconnect and exit
        }

        const password = 'NaiduRapeti@05';
        const hashedPassword = await bcrypt.hash(password, 12);

        const adminUser = new User({
            // --- FIX 2: Use 'name' to match your schema ---
            name: 'Naidu Rapeti',
            email: 'hackculprit@gmail.com',
            password: hashedPassword,
            isAdmin: true
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
    } catch (err) {
        console.error('Error seeding admin user:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin();