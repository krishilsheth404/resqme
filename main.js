// app using yahoo.com as a search engine
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const path = require('path');
const request = require('request');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'sql6.freesqldatabase.com',
    user: 'sql6688320',
    password: 'r5HHMtWrnR',
    database: 'sql6688320'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});


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

app.post('/booking-confirmed', (req, res) => {
    

   var final={ 
    customer_name: req.body.name,
  phone_number: req.body.number,
  email: req.body.email,
  queue_size: req.body.queue_size
};

   


  connection.query('INSERT INTO customers SET ?', final, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return;
    }
    console.log('Data inserted successfully');
  });
    
    console.log(final)

    connection.end((err) => {
        if (err) {
            console.error('Error closing connection: ' + err.stack);
            return;
        }
        console.log('Connection closed.');
    });

    res.render(__dirname + '/ticket-confirmed.ejs',{final:final});
    // res.sendFile(__dirname + '/index.html');
});


app.post('/fillDetails', (req, res) => {
    
    var final=[]
    final.push(req.body.count);
    final.push(req.body.queuepos);
    console.log(final)
    res.render(__dirname + '/user-details.ejs', { final: final });
    // res.sendFile(__dirname + '/index.html');
});


function convertMinutesToHours(minutes) {
    return Math.floor(minutes / 60); // Divide by 60 to get hours
}

// Function to fetch remaining minutes after converting to hours
function fetchRemainingMinutes(minutes) {
    return minutes % 60; // Modulus operator (%) gives the remainder
}
var countOfQueuePeople = 1;
var totalTimeForNextPerson = 0;
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

    console.log("Seat Count -> "+req.body.seatM);
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err.stack);
            return;
        }

        countOfQueuePeople = results.length;
        console.log('Fetched data:');
        results.forEach((row) => {
            console.log(row.queue_size);
            if (row.queue_size > 2 && row.queue_size <= 5) {
                totalTimeForNextPerson += 30;
            } else if (row.queue_size > 5 && row.queue_size <= 10) {
                totalTimeForNextPerson += 45;
            } else if (row.queue_size > 10) {
                totalTimeForNextPerson += 60;
            }
        });

        // Close the connection
        console.log(countOfQueuePeople);
        var hours = convertMinutesToHours(totalTimeForNextPerson)
        var minutes = fetchRemainingMinutes(totalTimeForNextPerson)

        const final = [];
        final.push({
            'queue_position': ++countOfQueuePeople,
            'total_time_hrs': hours,
            'total_time_mins': minutes,
        })

        final.push(req.body.seatM);

        
        res.render(__dirname + '/my-queue.ejs', { final: final });
       
    });






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