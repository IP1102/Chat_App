var moment = require('moment');

var generateMessage = (from,text) => {
    return {
        from:from,
        text:text,
        createdAt: moment().format()
    };
};


generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().format()  
    };
};


module.exports = {generateMessage, generateLocationMessage};
