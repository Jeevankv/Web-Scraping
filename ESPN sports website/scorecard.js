// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/punjab-kings-vs-royal-challengers-bangalore-3rd-match-1304049/full-scorecard";

const request = require("request");
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function processScoreCard(url){
    request(url, cb);
}

//main
function cb(err, request, html){
    if(err){
        console.log(err);
    }else{
        extractMatchDetail(html);
    }
}

function extractMatchDetail(html){
    /* Required Format */
    // venue date opponent result runs balls fours sixes SR
    
    let $ = cheerio.load(html);
    //venue and data
       let venDateEle = $('.ds-p-0 .ds-grow .ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid')

    
    let venue = venDateEle.text().split(",")[1].trim();
    let date = venDateEle.text().split(",")[2].trim()+", 2022"
    // console.log(venue,"\n",date);

    let matchResult = $('.ds-p-0 p span').text().trim();
    // console.log(matchResult.text());

    let innings = $(".ds-bg-fill-content-prime.ds-rounded-lg");
    // let htmlString = "";  // used for separation of html to make it easy to crap
    for(let i = 0; i<innings.length;i++){
        //  htmlString += $(innings[i]).html()
    // console.log(htmlString)


    let teamName = $(innings[i]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text().split("INNINGS")[0].trim();
    // console.log(teamName);

    let opponentIndex = i == 0 ? 1: 0;
    let opponentName = $(innings[opponentIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text().split("INNINGS")[0].trim();
    // console.log(opponentName)

    console.log(`${venue} | ${date} | ${teamName} | ${opponentName} | ${matchResult}`);
    
    let cInning = $(innings[i]);
    let allRows = cInning.find('.ds-bg-fill-content-prime.ds-rounded-lg .ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table  tbody tr');
    // console.log(allRows.length)
    console.log("```````````````````````````````````````````````````````````````````````````````````````````````````````");
    console.log()
    for(let j=0;j<allRows.length;j++){
        
        let breakPoint = $(allRows[j]).hasClass('ds-text-tight-s'); //every Extras row starts
        if(breakPoint == true){
            break;
        }
        let allCols = $(allRows[j]).find("td");
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        
        console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}` )
        

        processPlayer(teamName,playerName, runs, balls, fours, sixes,sr,opponentName,venue,date,matchResult)
 
        }
        console.log();
    }
}

function processPlayer(teamName,playerName, runs, balls, fours, sixes,sr,opponentName,venue,date,matchResult) {
    let teamPath = path.join(__dirname,"IPL",teamName);
    dirCreator(teamPath);

    let filePath = path.join(teamPath,playerName + ".xlsx");
    let content = excelReader(filePath,playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,fours,sixes,
        sr,
        opponentName,
        venue,
        date,
        matchResult

    }

    content.push(playerObj);
    excelWriter(filePath,content,playerName);

}

function dirCreator(filePath){ // creating IPL directory
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath, json, sheetName){
    let newWb = xlsx.utils.book_new();
    let newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb,newWs,sheetName);
    xlsx.writeFile(newWb,filePath);
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let jsonData = xlsx.utils.sheet_to_json(excelData);
    return jsonData
}

module.exports = {
   ps:processScoreCard
}

    
    
