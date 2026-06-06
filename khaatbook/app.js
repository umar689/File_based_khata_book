const express=require('express');
const app=express();
const fs = require('fs');
let c=0;
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.set('view engine','ejs')
 
app.get('/',function(req,res){
    fs.readdir('./hisaab', (err, files) => {
        if (err) throw err;

        console.log(files);
        res.render('index',{files});
    });
})

app.post('/', function(req, res) {
    let { title, content } = req.body;

    function createFile(count = 0) {
        let fileName =
            count === 0
                ? `./hisaab/${title}.txt`
                : `./hisaab/${title}(${count}).txt`;

        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err) {
                // file does not exist
                fs.writeFile(fileName, content, (err) => {
                    if (err) throw err;
                    console.log('File created');
                });
            } else {
                // file exists, try next number
                createFile(count + 1);
            }
        });
    }

    createFile();
    res.redirect('/');
});

app.get('/edit/:filename',function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`, 'utf8', (err, content) => {
        if(err) throw err;
        console.log(content);
        res.render('edit',{title:req.params.filename , content})
    });
    
})

app.post('/update/:title',function(req,res){
    fs.writeFile(`./hisaab/${req.params.title}`, req.body.data, (err) => {
        if(err) throw err;
        console.log('File created');
        res.redirect('/')
    });
})

app.get('/delete/:title',function(req,res){
    fs.unlink(`./hisaab/${req.params.title}`, (err) => {
        if(err) throw err;
        console.log('File deleted');
        res.redirect('/')
    });
})

app.get('/create',function(req,res){
    res.render('create');
})

app.get('/view/:filename',function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`, 'utf8', (err, content) => {
        if(err) throw err;
        console.log(content);
        res.render('hisaab',{title:req.params.filename , content})
    });
})

app.listen(8000,()=>{
    console.log('server is live at port 8000')
})