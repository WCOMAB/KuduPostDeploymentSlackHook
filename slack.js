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
        if (!parsedRequest || (parsedRequest.body||'').trim()==='') {
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
    var success     = (parsedBody.status=='Success' || (parsedBody.status=='success' && parsedBody.complete));
    return JSON.stringify({
        username:   getSlackUserName(parsedBody, success),
        icon_emoji: success ? ':sun_small_cloud:' : ':rain_cloud:',
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
        parsedBody.job_name 
        ? (success ? 'Completed: ' : 'Failed: ') + parsedBody.job_name 
        : (success ? 'Published: ' : 'Failed: ') + parsedBody.siteName
    );
}

function getSlackText(parsedBody)
{
    var hookType = parsedBody.job_name ? 'TriggeredJobFinished' : 'PostDepolyment';
    var hostName = parsedBody.hostName;
    var jobName = parsedBody.job_name;
    var jobDuration = parsedBody.duration ? parsedBody.duration.substring(0,8) : '';
    var timeStamp = (parsedBody.endTime !== undefined ? parsedBody.endTime : (parsedBody.end_time !== undefined ? parsedBody.end_time : '')).substring(0,19).replace("T", " ");
    var id = parsedBody.id;

    return (
        '>>> ' +
        (hookType == 'TriggeredJobFinished' ? 'Scheduled, took ' + jobDuration : 'Pushed by ' + (parsedBody.author !== undefined ? parsedBody.author + ' at ' : 'unknown at ')
        + timeStamp + '\r\n' +
        (hostName ? '<https://' + hostName + '|' + hostName + '> ' : '') +
        (id ? 'Id: ' + parsedBody.id : '') +
        (parsedBody.message ? '\r\n' + parsedBody.message : ''))
    );
}
