const path = require('path');

const express = require('express');

//path is relative to app.js
const defaultRoutes = require('./routes/default');
const restaurantRoutes = require('./routes/restaurant');
//jab relative nahi hota i.e absolute tab project folder ke respect mein path path daalte hain . wo path . se start nahi hota.
//main project ke folder ko root kehte hain

const app = express();

app.set('views', path.join(__dirname, 'views'));;;;//1st parameter is fixed and second paramter is path where u wish to store ejs files
app.set('view engine', 'ejs');//yehi likhna hota by default

app.use(express.static('public'));
//jab bhi koi http request aati hai toh ye check krta hai ki kahi ye static files toh ni mang rhi ye http reuqest?if yes toh express public folder mein dekh leta hai agar wo static file exist krti hai toh aur send kr deta hai browser ko.  
//lekin app.use waali cheez likhke hi public folder access hota hai by default nai hota
//yahan pr script aur css waali files(joki public mein hai) static hai because wo server side side code se dyanmically change nai ho rhi


app.use(express.urlencoded({ extended: false })
);
//it is used to extract(parse) incoming data and put it into req.body
//he { extended: false } option indicates whether the values in the URL-encoded data should be parsed using the querystring library (when false) or the qs library (when true)

app.use('/', defaultRoutes);//it is middleware jiski wjah se phle sar default routes ka code execute hoga server pe uske baad baki routes/route handlers ka.
app.use('/', restaurantRoutes);

//middlewares are something jo hr incoming request ko bhav dete hai
app.use(function (req, res) {//this will kick in whenever we have a request that is not handled by any of the above routes
    res.status(400).render('404');//.status() helps uss set a status(lecture-375)
});


app.use(function (error, req, res, next) {//hmien ye function 4 parametes ke sath hi likhna hota hai taki express ko smjh aa ske ki ye special error handling function hai(basically express ki built in feature hoti hai  server pe pe koi error aaye usko handle krne ke lie)
    res.status(500).render('500');
});

app.listen(process.env.PORT || 3000);

//chronology:sbse phle app.use() middleware ke through public folder access hota hai
//agar us se browser ki request poori nai hoti toh phir get requests pe aata hai cantrol aur phir
//bhi agar browser ki http request nai poori hoti toh request terminate ho jati hai