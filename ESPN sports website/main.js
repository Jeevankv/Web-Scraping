const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";

const request = require("request");
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const allMatchObj = require("./Allmatches");

const iplPath = path.join(__dirname,"IPL");
dirCreator(iplPath);

request(url, cb);
//main
function cb(err, response, html){
    if(err){
        console.log(err);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let $ = cheerio.load(html);
   let anchorElem = $('.ds-border-t.ds-border-line.ds-text-center.ds-py-2 a');
   const link = $(anchorElem[0]).attr("href")
//    console.log(link);
    
    const fullLink =  "https://www.espncricinfo.com"+link;
    console.log(fullLink);

    allMatchObj.gAlmatches(fullLink);
}

function dirCreator(filePath){ // creating IPL directory
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}
