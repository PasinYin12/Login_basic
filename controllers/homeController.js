const User = require('../models/user');

module.exports = async (request, response) => {
    let userData  = await User.findById(request.session.userId);
    response.render('home', {
        userData
    });
}