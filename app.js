const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set("view engines", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
}
const Articlemodel = mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
    Articlemodel.find({}, (err,foundarticles) => {
        if (err) {
            console.log(err);
        }
        else{
            res.send(foundarticles);
        }
    })
})

app.post('/articles', (req, res) => {
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Articlemodel({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(()=> {
        res.send("Article received");
    });
    console.log(newArticle);
})
app.delete("/articles", (req, res)=>{
    Articlemodel.deleteMany(()=> {
        console.log("Successfully deleted");
        res.send("Delete successfull")
    })
})


////////////////////////////Requests targetting a specific route/////////////


app.route("/articles/:articleTitle").
get((req,res) => {

    const articletitle = req.params.articleTitle;
    Articlemodel.findOne({title: articletitle}, (err,foundarticles)=> {
        if(!err) {
            res.send(foundarticles);
        }
        else{
            console.log(err);
        }
    } )
}

)
.put((req, res) => {
    Articlemodel.updateOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content},(err) => {
        if(!err) {
            res.send("Succesfully updated");
        }
        else
        {
            console.log(err);
        }
    })
}

)
.patch((req, res) =>{
    Articlemodel.updateOne({title:req.params.articleTitle},{$set: req.body},(err) => {
        if(!err) {
            res.send("Succesfully patched");
        }
        else
        {
            console.log(err);
        }
    })
}

)
.delete((req, res) =>{
    Articlemodel.deleteOne({title:req.params.articleTitle}, (err) =>{
        if(!err) {
            res.send("Succesfully Deleted");
        }
        else
        {
            console.log(err);
        }
    })
}

);


app.listen(3000, () => {
    console.log("listening on port 3000")
})