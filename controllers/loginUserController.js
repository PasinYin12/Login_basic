// controllers/loginUserController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = async (request, response) => {
    try {
        const { email, password } = request.body;
        
        console.log('Login attempt:', { email, password });

        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found for email:', email);
            request.flash('validationErrors', ['Invalid email or password']);
            return response.redirect('/login');
        }

        console.log('User found:', {
            email: user.email,
            hashedPassword: user.password,
            passwordLength: user.password.length
        });

        // Check if password is hashed (bcrypt hashes are 60 characters)
        if (user.password.length < 50) {
            console.log('WARNING: Password appears to be stored in plain text!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            request.flash('validationErrors', ['Invalid email or password']);
            return response.redirect('/login');
        }

        request.session.userId = user._id.toString();
        
        request.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return response.redirect('/login');
            }
            console.log('Login successful, redirecting...');
            return response.redirect('/home');
        });

    } catch (error) {
        console.error('Login error:', error);
        request.flash('validationErrors', ['An error occurred during login']);
        return response.redirect('/login');
    }
};