const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

async function scrapeMovies(url) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
    });
    const page = await browser.newPage();

    //waitUntil property very important to load all js on page otherwise nothing useful can be scraped!
    await page.goto(url, {waitUntil: 'networkidle0'});

    //get html for cheerio
    const html = await page.content();    
       
    /*  FLAGS HANDLED BELOW BY CHEERIO
    const [el] = await page.$x('/html/body/div[9]/div[1]/div[2]/div/div[5]/img[1]');
    
    const src = await el.getProperty('src');
    
    const srcTxt = await src.jsonValue();
    */
    var imgURLs = [];
    for (let i=2; i<5; i++) {
        //extract 1st item from returned array using $x selector with the x-path of name
        const [el2] = await page.$x(`/html/body/div[9]/div[1]/div[${i}]/div/img`);
        // Each time check that a search result has been scraped
        if (el2) {
            // Pull the text content
            const txt = await el2.getProperty('src');
            // Put it into string format
            const imageURL = await txt.jsonValue();
            imgURLs.push(imageURL);
            //console.log(imgURLs);
        }   
    }
    
    const movTitles = [];

    //need to sort out when no or <3 movies come back from search

    //Loop through top 3 search results' titles adding each to above array 
    for (let i=2; i<5; i++) {
        //extract 1st item from returned array using $x selector with the x-path of wins
        const [el3] = await page.$x(`/html/body/div[9]/div[1]/div[${i}]/div/div[3]/b/span`);
        
        if (el3) {
            // Pull the text content
            const wTxt = await el3.getProperty('textContent');
            // Put it into string format
            const title = await wTxt.jsonValue();
            movTitles.push(title);
        }
    }
    //console.log(movTitles);
    


    //cheerio to get flags
    const $ = cheerio.load(html);
    //const flCont = $('.sclist');
    //const flag = flCont.find('img').attr('src');
    /*let arr = [];
    const flags = $('.sclist img').each((i, fl) => {
        
        const item = $(fl).attr('title');
        console.log(item);
        arr.push(item);
        //console.log(arr);
        return arr;
    });*/
    const flags = [];
    $('.titleitem').each((i, ti) => {
        // Limit it to 3 movies per search
        if (i<3) {
            const arr =[];
            $(ti).find('.sclist img').each((n, im) => {
                // Limit to 5 flags per movie
                if (n<5) {
                    const flg = $(im).attr('src');
                    arr.push(flg);
                };
                //return arr;
            });       
            //console.log(arr);
            flags[i] = arr;
        }        
    });

    
    const countries = [];
    $('.titleitem').each((i, ti) => {
        // Limit it to 3 movies per search
        if (i<3) {
            const arr =[];
            $(ti).find('.sclist img').each((n, im) => {
                // Limit to 5 flags per movie
                if (n<5) {
                    const ctry = $(im).attr('title');
                    arr.push(ctry);
                };
                //return arr;
            });       
            //console.log(arr);
            countries[i] = arr;
        }        
    });

    browser.close();

    // Put each movie's details together in object which is stored in an object of movies
    const movies = {};
    // check there's a valid movie data (e.g. a title) before storing in object
    for (let i=0; movTitles[i] ; i++) { //i<3 previously
        movies[i] = {            
            title: movTitles[i],
            img: imgURLs[i],
            flagsArr: flags[i],
            ctryArr: countries[i],
            // Add uuid for local storage purposes
            id: uuidv4()
        };
    }
    
    console.log(movies);
    // test object size > 0 before sending with Object.keys(movies).length
    return movies;
    

}

module.exports = {
    scrapeMovies
}