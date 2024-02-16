const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'restaurants.json');//__dirname gives path of directory jisme currenly ye file present hai,uske baad '..' krne se ye upar chla jayega and then aage  data aur phir restaurant,json

function getStoredRestaurants() {
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);
    return storedRestaurants;
}

function storedRestaurants(storableRestaurants) {
    fs.writeFileSync(filePath, JSON.stringify(storableRestaurants));
}
module.exports = {
    getStoredRestaurants: getStoredRestaurants,//key_name(which will be used in other file where this function is exported):pointer to the function reffered
    storedRestaurants: storedRestaurants
};