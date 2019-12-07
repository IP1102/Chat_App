var isRealString = (str) => {
    return typeof str === 'string' && str.trim() > 0;
};

module.exports = {isRealString};