const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>');
});
app.get('/restaurants', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');

    res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
});
app.listen(3000);