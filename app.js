const express = require("express");
const bodyParser= require("body-parser");
const { query } = require("express");
const request=require("request");
const res = require("express/lib/response");


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');



app.get("/",function(req,res){
    res.render("index");
})

app.post("/result",function(req,res1){

    var nameOfMovie=req.body.movieName;
    nameOfMovie=nameOfMovie.replace(/\s/g, "");
   

    const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/auto-complete',
        qs: {q: nameOfMovie},
        headers: {
          'X-RapidAPI-Key': 'c11c7c4805msh467d23f7c4e75dap1297afjsnc84d8d253166',
          'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
          useQueryString: true
        }
    };
      
        request(options, function (error, response, body) {
            if (error) throw new Error(error);


            //to handle failure page
            
            const result=JSON.parse(body);
            console.log(result.message);
            if(result.message==='You have exceeded the MONTHLY quota for Requests on your current plan, BASIC. Upgrade your plan at https://rapidapi.com/apidojo/api/imdb8'){
                res1.redirect("/failure")
            }
            else{
                console.log(result);
                var idOfMovie=result.d[0].id;
                var imgLink=result.d[0].i.imageUrl;
                var rank=result.d[0].rank;
                var year=result.d[0].yr;
                // console.log(year);
                //other request
                if(typeof year =='undefined'){
                    year=""
                }
                console.log(year);
    
                const options1 = {
                    method: 'GET',
                    url: 'https://mdblist.p.rapidapi.com/',
                    qs: {i: idOfMovie},
                    headers: {
                    'X-RapidAPI-Key': 'c11c7c4805msh467d23f7c4e75dap1297afjsnc84d8d253166',
                    'X-RapidAPI-Host': 'mdblist.p.rapidapi.com',
                    useQueryString: true
                    }
                };
                
                request(options1, function (error, response1, body1) {
                    if (error) throw new Error(error);
                
                    //   console.log(JSON.parse(body1));
                    const result1=JSON.parse(body1)
                    var nameOfTheSeries=result1.title;
                    var releaseYear=result1.year;
                    var descriptionOfMovies=result1.description;
                    var ratingOfMovie=result1.ratings[0].value;
                    var numberOfVotes=result1.ratings[0].votes;
                    res1.render("result",{
                        nameOfTheMovie: nameOfTheSeries,
                        sourcesOfMovie: String(imgLink),
                        rankOfMovie:rank,
                        imdbOfMovie:ratingOfMovie,
                        imdbVotes:numberOfVotes,
                        yearOfRelease:releaseYear,
                        yearOfSeries:year,
                        descriptionOfMovie:descriptionOfMovies,
                    });
                });
            }
        }); 
});

app.get("/failure",function(req,res){
    res.render("failure");
})




app.listen(4000,function(){
    console.log("Hello");
})










