const path = require('path');

const express = require('express');//Express is a framework for Node.js

//path is relative to app.js
const defaultRoutes = require('./routes/default');
const restaurantRoutes = require('./routes/restaurant');


const app = express();

app.set('views', path.join(__dirname, 'views'));//1st parameter is fixed and second paramter is path where u wish to store ejs files
app.set('view engine', 'ejs');//by default

app.use(express.static('public'));


app.use(express.urlencoded({ extended: false })
);
//it is used to extract(parse) incoming data and put it into req.body

app.use('/', defaultRoutes);//it is middleware jiski wjah se phle sar default routes ka code execute hoga server pe uske baad baki routes/route handlers ka.
app.use('/', restaurantRoutes);

//middlewares are something jo hr incoming request ko bhav dete hai
app.use(function (req, res) {//this will kick in whenever we have a request that is not handled by any of the above routes
    res.status(400).render('404');
});


app.use(function (error, req, res, next) {//hmien ye function 4 parametes ke sath hi likhna hota hai taki express ko smjh aa ske ki ye special error handling function hai(basically express ki built in feature hoti hai  server pe pe koi error aaye usko handle krne ke lie)
    res.status(500).render('500');
});

app.listen(process.env.PORT || 3000);
--0o9o89i