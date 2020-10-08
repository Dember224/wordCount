const request = require('request')
const cheerio = require('cheerio')
const async = require('async')


let website = "https://www.vox.com"

function getLinks(site, callback){
  request(site, function(error, response, body){
    if(error){
      return callback(error);
    }

    const $ = cheerio.load(body)
    const hyperlinkTagArray = $('a').toArray().map(a =>{

      return $(a).attr('href');
    });

    const filteredhyperlinkTagArray = hyperlinkTagArray.filter(
      link => typeof link !== "undefined" && link.length > 29 && !link.includes("authors") && !link.includes("media") && !link.includes("book-club")
    )
    callback(null,filteredhyperlinkTagArray)
  })
};

getLinks(website,(e,result) => {
  if (e){
    throw `Disturbance in the force: ${e}`
  }
  async.map(
    result,
    (url, cb) => {
      request(url, function(error, response, html_body){
        if (error){
          return cb(error)
        }
        const $ = cheerio.load(html_body)
        const word = $('p').text()

        const wordArray = word.split(" ")
        cb(null, {url: url,count:wordArray.length})
        // console.log(`Article: ${url} Word count: ${wordArray.length} `)
      })
    }, (e, r)=>{
      if(e){
        throw `Everything is broken ${e}`
      }
      console.log(r)
    });
})
//
// function getLinks(site){
//   const getWebsite = request(site, function(error, response, body){
//
//     const $ = cheerio.load(body)
//     const hyperlinkTagArray = $('a').toArray().map(a =>{
//
//       return $(a).attr('href');
//     });
//
//     const filteredhyperlinkTagArray = hyperlinkTagArray.filter(
//       link => typeof link !== "undefined" && link.length > 29 && !link.includes("authors") && !link.includes("media") && !link.includes("book-club")
//     )
//
    // async.map(
    //   filteredhyperlinkTagArray,
    //   (url, results)=> {
    //     request(url, function(error, response, html_body){
    //       const $ = cheerio.load(html_body)
    //       const word = $('p').text()
    //
    //       const wordArray = word.split(" ")
    //
    //       console.log(`Article: ${url} Word count: ${wordArray.length} `)
    //     })
    //   });
//
//
//
//
//
//
//
//
//
//   });
// }
//
//
//
//
//
//
// getLinks(website)
