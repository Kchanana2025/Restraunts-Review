const express = require('express');
const router = express.Router();//express() function bss ek baar call hone chahie poore project mein wo bhi app.js file mein isliye hmne alag alternative chun lia i.e express.Router .express.Router() bhi express() jaisa hi hota hai bss internal working thodi different hai(L-378)

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/about', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'about.html');

    //res.sendFile(htmlFilePath);//resSendFile Automatically sets the Content-Type response header field file mein dekh ke basically ab browser pe html apne aap render ho jayegi alag se btana ni padhega ki ye html hai.
    res.render('about');
});

module.exports = router;
//poore ke poore object(router) ko hi export krdo uss se associated sare route handlers bhi export ho jayenge