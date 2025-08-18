const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./model/User');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
require("dotenv").config();
const adminRoutes = require("./Routes/admin/unverified");


const validateRoute = require("./Routes/admin/validation");




const verifyRoutes = require("./Routes/admin/verification");
const blogRoutes = require("./Routes/postRoutes");
const fetchRoutes = require("./Routes/Fetchroutes");
const testimonialRoutes = require('./Routes/Review_Route');
const Application = require('./Routes/ApplicationRoute');
const submitApplication = require('./Routes/internform');
const wordRoute = require("./Routes/wordRoute");
const lookupCertificate = require("./Routes/LookupRoute");
const GetMailList = require("./Routes/admin/EmailList_Routes");
const Login = require("./Routes/admin/LoginRoute");
const createTestimonial = require('./Routes/Review_Route');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// REMOVED: All session and passport middleware
// app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());


app.use((req, res, next) => {
    console.log("Original URL:", req.originalUrl);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        console.log('Database: HackCulprit_website');
        console.log("✅ Loaded acceptors email:", process.env.ACCEPTOR_EMAIL);

    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// JWT Secret
// Make sure JWT_SECRET is defined in your .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Validation middleware
const validateRegistration = [
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];


const certificateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per window
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});


const mailListLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 8, // limit each IP to 8 requests per window
    message: { success: false, message: "Too many download attempts" }
});


// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Hack Culprit Backend is running!',
        database: 'Connected to MongoDB',
        timestamp: new Date().toISOString()
    });
});

// Register route
app.post('/api/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;
        console.log('📝 Registration Data Received:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password ? '***' + password.slice(-3) : 'undefined');
        console.log('Raw Body:', JSON.stringify(req.body, null, 2));

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword
        });

        await user.save();

        console.log('✅ User registered successfully:', {
            id: user._id,
            name: user.name,
            email: user.email
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Login route
app.post('/api/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        console.log('🔐 Login Data Received:');
        console.log('Email:', email);
        console.log('Password:', password ? '***' + password.slice(-3) : 'undefined');
        console.log('Raw Body:', JSON.stringify(req.body, null, 2));

        const trimmedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('❌ Login failed: Invalid password for email:', trimmedEmail);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ User logged in successfully:', {
            id: user._id,
            name: user.name,
            email: user.email
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get user profile (protected route)
app.get('/api/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

app.use("/api/blog", blogRoutes);
app.use("/api", fetchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", validateRoute);
app.use("/api/admin", verifyRoutes);
app.use("/api/admin",rateLimit, Login);
app.use('/api/reviews', testimonialRoutes);
app.use('/api', createTestimonial);
app.use('/api/applications', Application);
app.use('/api/applicationform',rateLimit, submitApplication);
app.use('/api/word',mailListLimiter, wordRoute);
app.use('/api/lookupCertificate',certificateLimiter, lookupCertificate);
app.use('/api/Export',mailListLimiter,GetMailList);



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});