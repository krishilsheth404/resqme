// app using yahoo.com as a search engine
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const path = require('path');
const request = require('request');
const mysql = require('mysql');


// const connection = mysql.createConnection({
//     host :'sql12.freesqldatabase.com',
//     user:'sql12627038',
//     password:'nILwiGK3gB',
//     database:'sql12627038',
// })


const ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(express.static(__dirname));

// app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/amar', (req, res) => {
    // console.log((req.query['q']));
    res.sendFile(__dirname + '/index.html');
});
app.post('/amar', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/resqme', async (req, res) => {
    // Insert Login Code Here   
//     const pick =req.body.pick;
//     const dest =req.body.dest;

//     console.log(pick);
//     console.log(dest);
    
// const start = performance.now();
//     const browser = await puppeteer.launch({
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//         ],headless:true,
//     });;



//     extractLinksOfZomato = async (url) => {
//         try {
//             // Fetching HTML
         

            
            
//             const page = await browser.newPage();
//             await page.goto(url);
//             await page.setViewport({
//                 width: 1920,
//                 height: 2080
//             })
            
//             await page.waitForSelector('div[class="distanceLine"]');
//             let element = await page.$('div[class="distanceLine"]');
//             let element1 = await page.$('div[class="drDurationRoot"]');
// let value = await page.evaluate(el => el.textContent, element)
//  value = value + "  " + await page.evaluate(el => el.textContent, element1)
// console.log(value)

// const end = performance.now() - start;
//     console.log(`Execution time: ${end}ms`);
       
           
//         } catch (error) {
//             // res.sendFile(__dirname + '/try.html');
//             console.log(error);
//         }
//     };
//     z = await extractLinksOfZomato(`https://bing.com/maps/default.aspx?rtp=adr.${pick}~adr.${dest}`);
//     console.log(z);
console.log(req.body.seatM);
res.sendFile(__dirname + '/my-queue.html');


});




app.get('/limitedTimeOffers', async (req, res) => {

    const { data } = await axios.get("https://netmeds.com");
    const $ = cheerio.load(data);

    const final = [];
    $('.flashsale .swiper-slide').map((i, elm) => {
        final.push({
            title: ($(elm).find('.cat_title').first().text()),
            imgsrc: ($(elm).find('.cat-img img').first().attr('src')),
            fprice: ($(elm).find('#final_price').first().text()),
            oprice: ($(elm).find('.price').first().text()),
        });
    });
    res.send(final);

});


const port = process.env.PORT || 4000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));