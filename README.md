# Slack Event App

## Steps

* create slack workspace, add app
* download existing code
* install dependencies used

Configure node.js app
* copy oath token and slack verification token into .env file to keep them secret (file is not published on Github)

Create app on web server Heroku
* add heroku remote to existing Git repo

```bash
heroku git:remote -a slack-event-app
````

* Add heroku page (https://slack-event-app.herokuapp.com/slack/events) to event subscriptions with toggle on,
Add event 'member joined channel"'

install web to workspace