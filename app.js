const path = require('path');
const express = require('express');
const app = express();
const uuid = require('uuid');


app.set('views', path.join(__dirname, 'views'))//1st parameter is fixed and second paramter is path where u wish to store ejs files
app.set('view engine', 'ejs');//yehi likhna hota by default

const fs = require('fs');


app.use(express.static('public'));
//jab bhi koi http request aati hai toh ye check krta hai ki kahi ye static files toh ni mang rhi ye http reuqest?if yes toh express public folder mein dekh leta hai agar wo static file exist krti hai toh aur send kr deta hai browser ko.  
//lekin app.use waali cheez likhke hi public folder access hota hai by default nai hota
//yahan pr script aur css waali files(joki public mein hai) static hai because wo server side side code se dyanmically change nai ho rhi


app.use(express.urlencoded({ extended: false })
);
//it is used to extract(parse) incoming data and put it into req.body
//he { extended: false } option indicates whether the values in the URL-encoded data should be parsed using the querystring library (when false) or the qs library (when true)

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/restaurants', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');

    // res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type 
    // response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    res.render('restaurants', { numberOfRestaurants: storedRestaurants.length, restaurants: storedRestaurants });
});

app.get('/restaurants/:id', function (req, res) {//in this function we can use that particular contrete value of id for that particular restaurant 

    const restaurantId = req.params.id;//ye hai uss id ki value
    //now we can load data of our restaurant have that particular id from restaurants.json file

    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render('restaurant-detail', { restaurant: restaurant });
        }
        //ab yaha hm kuch aur bhi return krskte thee to show ki page exist ni krta
        //by default method is to show 404 page
        res.status(404).render('404');
    }

    // return jab bhi call krte hain toh uske aage jo bhi saman hota hai as object return ho jata hai(which is not important here) kyunki ye function kahi call hi nai hua
    //return jab call krte hai toh aage ka code execute nai hota

});




app.get('/recommend', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    // res.sendFile(htmlFilePath);
    res.render('recommend');
});
//agar aap 1 se zyada app.get() lga dooge ek hi server mein toh upar wala execute hoga neeche wala execute nai hoga.neeche wala app.get() redundant ho jayega 
// because code top to bottom execute hota hai
//lekin agar HTTP method alag hai toh same hi path ke lie 2 alag alag route bna skte hai



app.post('/recommend', function (req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();//uuid object pr jab hum v4 method call krege toh ye hmesha unique value dega joki string hogi
    //javascript mein agar koi object ke corresponding particular property exist nai krti aur aap phir bhi object.that_property kr dete ho,toh wo property exist krne lag jati hai. 
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    storedRestaurants.push(restaurant);
    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));
    // res.send mein hum data recieved vgera nai daalege(jaise phle daala tha) because agar user uss page ko reload krde toh data wapis submit na ho jaye(uss se data 2 baar submit ho jayega) kyunki uss case mein path /recommended hi rahega aur wohi URL ko reload karoge toh hmesha POST request hi hogi already entered data ki .(if confused watch L-360)
    //isliye hmne redirect hi kr dia ab confirm page ko reload krke toh /confirm wala route with get request(joki neeche hai) wo chalega and confirm.html display hoga
    res.redirect('/confirm');//basically kisi nye page pe aana zruri hai after the form is submitted(taki user galti se dobara submission of data na krde)
});





app.get('/confirm', function (req, res) {
    //const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    //res.sendFile(htmlFilePath);
    res.render('confirm');
});
app.get('/', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(htmlFilePath);
});
app.get('/about', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'about.html');

    //res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
    res.render('about');
});

//middlewares are something jo hr incoming request ko bhav dete hai
app.use(function (req, res) {//this will kick in whenever we have a request that is not handled by any of the above routes
    res.status(400).render('404');//.status() helps uss set a status(lecture-375)
});


app.use(function (error, req, res, next) {//hmien ye function 4 parametes ke sath hi likhna hota hai taki express ko smjh aa ske ki ye special error handling function hai(basically express ki built in feature hoti hai  server pe pe koi error aaye usko handle krne ke lie)
    res.status(500).render('500');
});

app.listen(3000);

//chronology:sbse phle app.use() middleware ke through public folder access hota hai
//agar us se browser ki request poori nai hoti toh phir get requests pe aata hai cantrol aur phir
//bhi agar browser ki http request nai poori hoti toh request terminate ho jati hai 