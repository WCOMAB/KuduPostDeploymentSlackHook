var https                   = require('https');
var url                     = require('url');
var slackHookRequestOptions = getSlackHookRequestOptions();
module.exports.sendToSlack  = sendToSlack;

function getSlackHookRequestOptions()
{
    var hookUri     =   url.parse(process.env.slackhookuri);
    return {
        host:       hookUri.hostname,
        port:       hookUri.port,
        path:       hookUri.path,
        method:     'POST',
        headers:    { 'Content-Type': 'application/json' }
    };
}

function sendToSlack(parsedRequest, callback)
{
        if (!parsedRequest || (parsedRequest.body||'').trim()=='') {
            callback(true);
            return;
        }

        var error           = false;
        var slackMessage    = convertToSlackMessage(parsedRequest.body, parsedRequest.channel);
        var req             = https.request(slackHookRequestOptions);

        req.on('error', function(e) {
            console.error(e);
            error = true;
        });

        req.on('close', function() { callback(error); } );

        req.write(slackMessage);
        req.end();
}

function convertToSlackMessage(body, channel)
{
    var parsedBody  = trParseBody(body);
    var success     = (parsedBody.status=='success' && parsedBody.complete);
    return JSON.stringify({
        username:   getSlackUserName(parsedBody, success),
        icon_emoji: success ? ':shipit:' : ':warning:',
        text:       getSlackText(parsedBody),
        channel:    channel || process.env.slackchannel
    });
}

function trParseBody(body)
{
    try
    {
        return JSON.parse(body) || {
            status: 'failed',
            complete: false
        };
    } catch(err) {
        console.error(err);
        return {
            status: err,
            complete: false
        };
    }
}

function getSlackUserName(parsedBody, success)
{
    return (
        (success ? 'Published:': 'Failed:') +
        ' ' +
        (parsedBody.siteName || 'unknown') +
        ' (' +
        (parsedBody.id || '') +
        ')'
    );
}

function getSlackText(parsedBody)
{
    return (
        'Initiated by: ' +
        (parsedBody.author || 'unknown') +
        ' ' +
        (parsedBody.endTime || '') +
        '\r\n```' +
        (parsedBody.message || 'null message') +
        '```'
    );
}