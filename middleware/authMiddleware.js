const user = require('../models/user');

module.exports = (request, response, next) => {
    user.findById(request.session.userId).then((user) => {
        if (!user) {
            return response.redirect('/login');
        }
        console.log('User is logged in successfully');
        next();
    }).catch((error) => {
        console.log(error);
        return response.redirect('/login');
    });
};