const express = require('express')
const app = express();
const path = require('path');

app.use('/sounds', express.static(path.join(__dirname,'sounds')));
app.use('/', express.static(path.join(__dirname,'dist/pos')));

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'dist/pos', 'index.html'));
});


app.listen(process.env.PORT || 5000)