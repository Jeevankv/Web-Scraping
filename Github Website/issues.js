const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');


function getIssuesHtml(url, topic, repoName){
    request(url, cb);

    function cb(err, response, html){
        if(err){
            console.log(err);
        }else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else{
            // console.log(html);
            getIssues(html); 
              
        }
    }
    function getIssues(html){
        let $ = cheerio.load(html);
        let issuesEleArr = $('.Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title');
        console.log(issuesEleArr.length);
        let arr = [];
        for(let i = 0; i< issuesEleArr.length;i++){
            let link = $(issuesEleArr[i]).attr("href")
            arr.push(link);
        }
        
        let folderPath = path.join(__dirname,topic);
        dirCreator(folderPath);

        let filePath = path.join(folderPath,repoName + ".pdf");
        let text = JSON.stringify(arr);
        // Reference Link for creating PDF 
        //https://stackabuse.com/generating-pdf-files-in-node-js-with-pdfkit/
        let pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.text(text);
        pdfDoc.end()
        
    }
}

function dirCreator(folderPath){
if(fs.existsSync(folderPath) == false){
    fs.mkdirSync(folderPath);
}
}
module.exports = getIssuesHtml;