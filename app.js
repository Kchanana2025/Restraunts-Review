const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
//it is used to extract(parse) incoming data and put it into req.body
//he { extended: false } option indicates whether the values in the URL-encoded data should be parsed using the querystring library (when false) or the qs library (when true)

app.get('/restaurants', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');

    res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
});
app.use(express.static('public'));
//jab bhi koi http request aati hai toh ye check krta hai ki kahi ye static files toh ni mang rhi ye http reuqest?if yes toh express public folder mein dekh leta hai agar wo static file exist krti hai toh aur send kr deta hai browser ko.  
//lekin app.use waali cheez likhke hi public folder access hota hai by default nai hota
//yahan pr script aur css waali files(joki public mein hai) static hai because wo server side side code se dyanmically change nai ho rhi
app.get('/recommend', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    res.sendFile(htmlFilePath);
});
//agar aap 1 se zyada app.get() lga dooge ek hi server mein toh upar wala execute hoga neeche wala execute nai hoga.neeche wala app.get() redundant ho jayega 
// because code top to bottom execute hota hai
//lekin agar HTTP method alag hai toh same hi path ke lie 2 alag alag route bna skte hai



app.post('/recommend', function (req, res) {
    const restaurant = req.body;
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    storedRestaurants.push(restaurant);
    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));
    // res.send mein hum data recieved vgera nai daalege(jaise phle daala tha) because agar user uss page ko reload krde toh data wapis submit na ho jaye(uss se data 2 baar submit ho jayega) kyunki uss case mein path /recommended hi rahega aur wohi URL ko reload karoge toh hmesha POST request hi hogi already entered data ki .(if confused watch L-360)
    //isliye hmne redirect hi kr dia ab confirm page ko reload krke toh /confirm wala route with get request(joki neeche hai) wo chalega and confirm.html display hoga
    res.redirect('/confirm');
});





app.get('/confirm', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    res.sendFile(htmlFilePath);
});
app.get('/', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(htmlFilePath);
});
app.get('/about', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'about.html');

    res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
});
app.listen(3000);

//chronology:sbse phle app.use() middleware ke through public folder access hota hai
//agar us se browser ki request poori nai hoti toh phir get requests pe aata hai cantrol aur phir
//bhi agar browser ki http request nai poori hoti toh request terminate ho jati hai 