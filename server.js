const express = require('express')
const app = express();
const path = require('path');

app.use('/sounds', express.static(path.join(__dirname,'sounds')));
app.use('/', express.static(path.join(__dirname,'dist/pos')));
app.listen(process.env.PORT || 5000)