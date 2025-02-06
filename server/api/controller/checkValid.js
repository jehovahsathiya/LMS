exports.checkvalidation = function (data) {

    //Email Validation
    const { username, phone } = data;
    // Your validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return ({ status: "400", conc: "username", message: 'Wrong Email Format' });
    }

    // Phone Number Validation 
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return ({ status: "400", conc: "phone", message: 'Invalid phone number. Please enter a 10-digit phone number' });
    }


    return ({ status: "200", conc: "success", message: '"Success"' });


};