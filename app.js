// import required packages
const express= require("express");
const https= require("https");
const bodyparser= require("body-parser");

const app= express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

// On the home route, send signup html template
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API 
app.post("/",function(req,res){
  var firstName=req.body.fN;
  var email=req.body.Email;
  var lastNAme=req.body.lN;

  var data={
    members:[{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastNAme
      }
    }]
  }

// Converting string data to JSON data
const jsonData= JSON.stringify(data);
const url="https://us21.api.mailchimp.com/3.0/lists/512a569536";
const options={
  method:"POST",
  auth:"Karthik kammari:5e941cb9da552c4849c1186b5e3b1ee6-us21"
}

// On success send users to success, otherwise on failure template 
const request=https.request(url,options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }else{
    res.sendFile(__dirname+"/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });
});
  request.write(jsonData);
  request.end();
});

// Failure route
app.post("/failure",function(req,res){
   res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000.");
})