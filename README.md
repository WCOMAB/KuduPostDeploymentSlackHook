# Kudu Post Deployment Slack Hook

This is a very simple [Node.js](https://nodejs.org/) based [Azure](https://azure.com/) web app post deployment hook that notifies deployment status to [Slack](https://slack.com/) via an incoming webhook.
![Azure web app deployment Slack notification](https://raw.githubusercontent.com/WCOMAB/KuduPostDeploymentSlackHook/master/kudupostdeploymentslackhook.png)

## Configuration

1. Set up an [incoming webhook integration](https://my.slack.com/services/new/incoming-webhook/) in your Slack team.
2. Configure an environment variable named `slackhookuri` with the value of the above Slack web hook uri. In Azure you do it via the [application settings](https://azure.microsoft.com/en-us/documentation/articles/web-sites-configure/#application-settings) 
3. Add the uri to your Azure web app Kudu portal web hooks, you reach it via `https://{your azure web app}.scm.azurewebsites.net/WebHooks`
4. Optionally you can add an channel query parameter to the hook reuse the Slack hook and override which channel post deployment notifies to i.e.
`https://{your azure web post deployment app}.azurewebsites.net/?channel=%40devlead`

## Deployment

You can deploy the web project using the button below
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

## Testing
### Start webserver
1. Have [Node.js](https://nodejs.org/) installed, that should be the only dependency
2. From command line be in the repositories directory and type `node server.js` (default uri locally is `http://localhost:1337/`)
3. From another command line be in the repositories directory and type `node test.js`
4. If alls well you should see an message on Slack

### Kudu JSON payload example
```
{
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
}
```

