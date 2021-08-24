// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const scraper = require('./scraper');
const bodyParser = require('body-parser');

//app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: false }))

app.use(express.json());

/*function test(req, res, next) {
  app.use(express.static("public"));
  next();
}*/

// make all the files in 'public' available
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

/*
//server test 
app.get("/movies", (request, response) => {
  response.send({msg: 'server working'});
});*/


app.post("/movies", async (request, response, next) => {
  try {
    const movieData = await scraper.scrapeMovies(request.body.search);
    response.send(movieData);
    } catch(e) {
      console.error(e);
      }
  next();
});

// listen for requests 
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});