"use strict";

require('dotenv').config();

/*
 * Configuration
 */ 

// NPM packages to get everything working
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const qs = require('querystring');

const dialogTemplate = require('./dialog');

// grab the environment variables
const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
const SLACK_WELCOME_CHANNEL = process.env.SLACK_WELCOME_CHANNEL;
const SLACK_POST_TO_CHANNEL = process.env.SLACK_POST_TO_CHANNEL;

// set up the Express app
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up Axios
axios.defaults.baseURL = 'https://slack.com';
axios.defaults.headers.common['Authorization'] = `Bearer ${SLACK_OAUTH_TOKEN}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/*
 * Default endpoint
 */
app.get('/', (req, res) => {
  res.send('<h2>The app is running</h2> <p>Follow the' +
  ' instructions in the README to configure the Slack App and your environment variables.</p>');
});

/*
 * Endpoint to receive events to which your app is subscribed
 * https://api.slack.com/events-api
 */
app.post('/slack/events', (req, res) => {
    switch (req.body.type) {
      case 'url_verification': {
        // When setting up your app, Slack sends a verification challenge to the URL you specify
        // and expects you to echo it back immediately.
        // https://api.slack.com/events-api#request_url_configuration__amp__verification
        res.send({ challenge: req.body.challenge });
        break;
      }
      case 'event_callback': {
        if (req.body.token === SLACK_VERIFICATION_TOKEN) {
          const event = req.body.event;

          if(event.type === 'member_joined_channel'){
            res.status(200).end();

            // you will receive a `member_joined_channel` event for every channel, so make sure it's the right one
            if(event.channel === SLACK_WELCOME_CHANNEL){
              // The chat.postEphemeral method posts a message that only a specific user can see
              // https://api.slack.com/methods/chat.postEphemeral
              axios.post('/api/chat.postEphemeral', {
                channel: event.channel,
                user: event.user,
                text:
                  'Welcome to the company party channel, we\'re so excited you\`re here! You can help us get ready by filling out a quick form with a little more information.',
                attachments: [
                  {
                    text: '',
                    fallback:
                      'Welcome to the company party channel! Since your client doesn\'t support dialogs, check in with the party planning committe.',
                    callback_id: 'party_starter',
                    color: '#3AA3E3',
                    attachment_type: 'default',
                    actions: [
                      {
                        name: 'chooser',
                        text: 'Show me the form!',
                        type: 'button',
                        value: 'show_form'
                      },
                      {
                        name: 'chooser',
                        text: 'Maybe later',
                        type: 'button',
                        value: 'later'
                      }
                    ]
                  }
                ]
              })
              .then(function(res){
                // console.log(res);
              })
              .catch(function (error) {
                console.log(error);
              });
            }
          }
        } else { res.sendStatus(500); }
        break;
      }
    default: { res.sendStatus(500); }
  }
});


/*
 * Endpoint to receive interactive components like message buttons, menus or dialogs from Slack.
 * https://api.slack.com/interactive-messages
 */
app.post('/slack/components', (req, res) => {
  // the payload will vary depending on the type of component -- message button or dialog -- is being sent
  // console log it out to get a feel for it
  const payload = JSON.parse(req.body.payload);
  //console.log(payload);

  //verify the request is coming from Slack by validating the token
  if (payload.token === SLACK_VERIFICATION_TOKEN) {
    //respond immediately 
    res.status(200).end();
    
    switch (payload.type){
      case 'interactive_message': {
        // More info on what interactive message submissions looke like here:
        // https://api.slack.com/docs/interactive-message-field-guide#action_payload
        const action = payload.actions[0];
    
        // the user has clicked the button to show the form
        if(action['value'] === 'show_form'){
          // respond by sending the actual dialog
          const welcomeDialog = dialogTemplate(payload.trigger_id);
          axios.post('https://slack.com/api/dialog.open', welcomeDialog)
            .then(function(res){
              //console.log(res);
          })
          .catch(function (error) {
              console.log(error);
            });  
        }
        // TODO: handle the case of what happens if the user clicks the `later` button. Maybe remind them in a day?
      }
      case 'dialog_submission': {
        // The user has submitted the dialog
        // More details on what Dialog submissions look like here: https://api.slack.com/dialogs#response
        const submission = payload.submission;
        
        // `chat.postMessage` posts a message that everyone in the channel can see
        // https://api.slack.com/methods/chat.postMessage
        // TODO: rather than post this to a Slack channel, can you submit this to an online spreadsheet or database, like Airtable?
        axios.post('/api/chat.postMessage', {
          channel: SLACK_POST_TO_CHANNEL,
          attachments: [
            {
              fallback: "Someone is coming to the party!",
              color: "#99badd",
              pretext: ":tada: Someone is coming to the party!",
              title: `${submission['full-name']}`,
              text: `${submission['message-url']}`,
              fields: [
                {
                  title: "T-shirt size",
                  value: `${submission['shirt-size']}`,
                  short: false
                }
              ]
            }
          ]
        })
        .then(function(res){
          // console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        });
        
      }
    }
  } else { res.sendStatus(500); }
});


/*
 * Endpoint to receive slash commands from Slack.
 * https://api.slack.com/slash-commands
 * 
 * TODO: add a slash command to the app that does something like show the
 * complete list of people coming to the party
 */
app.post('/slack/commands', (req, res) => {
  // respond immediately!
  res.status(200).end();
  
  // the slash command will send you a payload containing a token, 
  // any text from the user,
  // a response_url for responding to the user,
  // and a trigger_id for using with interactive messages
  const { token, text, response_url, trigger_id } = req.body;

  //verify the request is coming from Slack by validating the token
  if (token === SLACK_VERIFICATION_TOKEN) {
    //do things :)
    axios.post(response_url, {text: text})
    .then(function (text) {
      console.log(text);
    });
  } else { res.sendStatus(500); }
});

/*
 * Start the express server
 */
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
