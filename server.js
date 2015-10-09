var express = require('express'),
    path = require('path'),
    port = process.env.PORT || 8080,
    app = express();

app.use(express.static(path.resolve('.')));

app.get('*', function(request, response){
  console.log('responding with index!');
  response.sendFile(path.resolve('./index.html'));
});

app.listen(port);
console.log("server started on port " + port);