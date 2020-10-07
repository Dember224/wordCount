const request = require('request')
const cheerio = require('cheerio')

let website = "https://www.vox.com/2020/10/6/21504499/coronavirus-joint-chiefs-staff-coast-guard-test-positive"

const getWebsite = request(website, function(error, response, body){

  const $ = cheerio.load(body)
  const word = $('p').text()

  const wordArray = word.split(" ")

  console.log(wordArray.length)
});



getWebsite
