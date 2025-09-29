module.exports = (request, response) => {

    let email = '';
    let password = '';
    let data = request.flash('data')[0];
    if (typeof data != 'undefined') {
        email = data.email;
        password = data.password;
    }
    response.render('register', {
        errors: request.flash('validationErrors'),
        email: email,
        password: password
    })
}