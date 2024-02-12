const express = require('express');
const app = express();
const path = require('path');

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