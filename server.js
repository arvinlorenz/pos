const express = require('express')
const app = express()

app.use('/', express.static(path.join(__dirname,'dist/pos')));
app.listen(process.env.PORT || 5000)