const express = require('express');
const uuid = require('uuid');

const resData = require('../util/restaurant-data');

const router = express.Router();

router.get('/restaurants', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');

    // res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type 
    // response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.

    let order = req.query.order;
    let nextOrder = 'desc';


    if (order != 'asc' && order != 'desc') {
        order = 'asc'
    }
    if (order === 'desc') {
        nextOrder = 'asc'
    }
    const storedRestaurants = resData.getStoredRestaurants();
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : null;
    let filteredRestaurants = storedRestaurants;

    if (searchQuery) {
        filteredRestaurants = storedRestaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchQuery)
        );
    }

    // Sort the filtered results
    filteredRestaurants.sort(function (resA, resB) {
        if (order === 'asc' && resA.name > resB.name) return 1;
        else if (order === 'desc' && resB.name > resA.name) return 1;
        return -1;
    });

    // Render the results with filtered and sorted data
    res.render('restaurants', {
        numberOfRestaurants: filteredRestaurants.length,
        restaurants: filteredRestaurants,
        nextOrder: nextOrder, 
        searchQuery: searchQuery
    });
});

router.get('/restaurants/:id', function (req, res) {//in this function we can use that particular contrete value of id for that particular restaurant 

    const restaurantId = req.params.id;//ye hai uss id ki value
    //now we can load data of our restaurant have that particular id from restaurants.json file
    const storedRestaurants = resData.getStoredRestaurants();

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render('restaurant-detail', { restaurant: restaurant });
        }
    }
    //ab yaha hm kuch aur bhi return krskte thee to show ki page exist ni krta
    //by default method is to show 404 page
    res.status(404).render('404');


    // return jab bhi call krte hain toh uske aage jo bhi saman hota hai as object return ho jata hai(which is not important here) kyunki ye function kahi call hi nai hua
    //return jab call krte hai toh aage ka code execute nai hota
});

router.get('/recommend', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    // res.sendFile(htmlFilePath);
    res.render('recommend');
});
//agar aap 1 se zyada app.get() lga dooge ek hi server mein toh upar wala execute hoga neeche wala execute nai hoga.neeche wala app.get() redundant ho jayega 
// because code top to bottom execute hota hai
//lekin agar HTTP method alag hai toh same hi path ke lie 2 alag alag route bna skte hai



router.post('/recommend', function (req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();//uuid object pr jab hum v4 method call krege toh ye hmesha unique value dega joki string hogi
    //javascript mein agar koi object ke corresponding particular property exist nai krti aur aap phir bhi object.that_property kr dete ho,toh wo property exist krne lag jati hai. 
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storedRestaurants(restaurants);
    // res.send mein hum data recieved vgera nai daalege(jaise phle daala tha) because agar user uss page ko reload krde toh data wapis submit na ho jaye(uss se data 2 baar submit ho jayega) kyunki uss case mein path /recommended hi rahega aur wohi URL ko reload karoge toh hmesha POST request hi hogi already entered data ki .(if confused watch L-360)
    //isliye hmne redirect hi kr dia ab confirm page ko reload krke toh /confirm wala route with get request(joki neeche hai) wo chalega and confirm.html display hoga
    res.redirect('/confirm');//basically kisi nye page pe aana zruri hai after the form is submitted(taki user galti se dobara submission of data na krde)
});

router.get('/confirm', function (req, res) {
    //const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    //res.sendFile(htmlFilePath);
    res.render('confirm');
});
router.get('/', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'index');
    res.sendFile(htmlFilePath);
});

module.exports = router;