var http           = require('http');
var testOptions    = {
                        host:       'localhost',
                        port:       process.env.port || 1337,
                        path:       '/',
                        method:     'POST',
                        headers:    { 'Content-Type': 'application/json' }
                     };

var jsonTests = [
    JSON.stringify({
      "id": "2bdc42572263361fef1a3334c562be57dfb06c27",
      "status": "success",
      "statusText": "",
      "authorEmail": "test@test.com",
      "author": "John Doe",
      "message": "Epic new feature!",
      "progress": "",
      "deployer": "",
      "receivedTime": "2015-06-11T09:58:46.9983824Z",
      "startTime": "2015-06-11T10:39:02.1322211Z",
      "endTime": "2015-06-11T10:39:07.555094Z",
      "lastSuccessEndTime": "2015-06-11T10:39:07.555094Z",
      "complete": true,
      "siteName": "azure-dummy-site"
    }),
    JSON.stringify({
      "id": "2bdc42572263361fef1a3334c562be57dfb06c27",
      "status": "failure",
      "statusText": "",
      "authorEmail": "test@test.com",
      "author": "John Doe",
      "message": "Epic failure!",
      "progress": "",
      "deployer": "",
      "receivedTime": "2015-06-11T09:58:46.9983824Z",
      "startTime": "2015-06-11T10:39:02.1322211Z",
      "endTime": "2015-06-11T10:39:07.555094Z",
      "lastSuccessEndTime": "2015-06-11T10:39:07.555094Z",
      "complete": false,
      "siteName": "azure-dummy-site"
    })
];

jsonTests.forEach(function(testJson){
    var req = http.request(testOptions, function(res) {
        console.log(res.statusCode);
        });
    req.write(testJson);
    req.end();
});