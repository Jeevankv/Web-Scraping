const request = require("request");
const cheerio = require('cheerio');

const scoreCardObj = require("./scorecard")
function getAllMatchesLink(url){
    request(url, function(err, response,html){
       
            if(err){
                console.log(err);
            }else{
                extractAllLink(html);
            }
    })
     
}

function extractAllLink(html){
    let $ = cheerio.load(html);
    // let scoreCardElems = $('.ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent span a') 
    let scoreCardElems = $('.ds-p-0 .ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent > a') 

    for(let i = 0;i<scoreCardElems.length;i++){
        // console.log($(scoreCardElems[i]).text());
        let link = $(scoreCardElems[i]).attr('href');
        const fullLink =  "https://www.espncricinfo.com"+link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);
    } 
}

module.exports = {
    gAlmatches : getAllMatchesLink
}