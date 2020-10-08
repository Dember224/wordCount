const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

let website = "https://www.vox.com"

async.waterfall([
  function(callback){
    request(website, function(error, response, body){
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
  },

  function(linkList, callback){
    async.map(
      linkList,
      (url, cb) =>{
        request(url, function(error, response, html_body){
          if(error){
            return cb(error)
          }
          const $ = cheerio.load(html_body)
          const word = $('p').text()

          const wordArray = word.split(" ")
          cb(null, {url: url,count:wordArray.length})
        })
      },
      callback

    )


  }

], function(err, result){
  if(err){
    throw `Everything is broken ${err}`
  }
  console.log(result)
}

)
