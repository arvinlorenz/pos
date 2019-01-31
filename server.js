const express = require('express')
const app = express();
const path = require('path');

app.use('/sounds', express.static(path.join(__dirname,'sounds')));
app.use('/', express.static(path.join(__dirname,'dist/pos')));

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'dist/pos', index.html))
}) //return to index if not about routes


app.listen(process.env.PORT || 5000)