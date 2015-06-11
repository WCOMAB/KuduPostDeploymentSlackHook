var http    = require('http');
var url     = require('url');
var slack   = require('./slack.js');
var port    = process.env.port || 1337;

http.createServer(function (req, res) {
    var parsedRequest = parseRequest(req);

    req.on('end', function () {
            if (!parsedRequest.body || parsedRequest.body == '')
            {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("WCOM AB - Kudu Post Deployment Slack Hook");
                return;
            }
            slack.sendToSlack(parsedRequest, function(error) {
                var result = {
                        status: 500,
                        text:   "Sorry!\r\n"
                    };
                if (!error) {
                    result.status   = 200;
                    result.text     = "Thanks!";
                }
                res.writeHead(result.status, { 'Content-Type': 'text/plain' });
                res.end(result.text);
            })
        });
}).listen(port);

function parseRequest(req)
{
    var parsedRequest = {
        body:       '',
        channel:    url.parse(req.url, true).query.channel
    };

    req.on('data', function (chunk) { parsedRequest.body += chunk; });

    return parsedRequest;
}