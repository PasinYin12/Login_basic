// controllers/storeUserController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = async (request, response) => {
    try {
        const { username, email, password } = request.body;
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashing password for new user:', email);
        
        // Create user with hashed password
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        console.log('User created successfully with hashed password');
        request.flash('success', 'Registration successful! Please login.');
        response.redirect('/login');
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(
                key => error.errors[key].message
            );
            request.flash('validationErrors', validationErrors);
            request.flash('data', request.body);
            return response.redirect('/register');
        }
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            request.flash('validationErrors', [`${field} already exists`]);
            request.flash('data', request.body);
            return response.redirect('/register');
        }
        
        request.flash('validationErrors', ['An error occurred during registration']);
        response.redirect('/register');
    }
};