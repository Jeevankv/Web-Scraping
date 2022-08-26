const request = require('request');
const cheerio = require('cheerio');
const getIssuesHtml = require('./issues');


function getReposPageHtml(url, topic){
    request(url, cb);

    function cb(err, response, html){
        if(err){
            console.log(err);
        }else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else{
            getReposLink(html); 
              
        }
    }
    function getReposLink(html){
       let $ = cheerio.load(html);
       let linkEleArr = $('.f3 .text-bold.wb-break-word');
       console.log("Topic: ",topic);
       for(let i = 0;i<8;i++){
            let hrefLink = $(linkEleArr[i]).attr('href');
            // console.log(hrefLink);
            let fullLink = "https://github.com/"+hrefLink+"/issues";
            console.log(fullLink);
            let repoName = hrefLink.split('/').pop();
            
            getIssuesHtml(fullLink, topic, repoName);
       }
       console.log("```````````````````````````````````````````````");
    }
}

module.exports = getReposPageHtml;