# Slack Event App

  <img src="https://user-images.githubusercontent.com/99111208/163757080-7f2759a7-db33-4b4c-b359-d7f2da4e0722.png" alt="open dialog form in chat">

## Description and Objective

I developed this Slack Event App as part of my Full-Stack Web Development Course at CareerFoundry. This project was primarily an exercise in customizing an existing app boilerplate and connecting it to the app.

### What technology used and why?

The app is written (by slack) in Node.js and makes use of the Web, Events API, and
Conversations APIs. It covers topics such as message formatting and interactive
messages. The app is intended to work as a custom, internal app, but the general
principles would apply to any other app built for public distribution in the Slack app directory, as well.

### What challenges did I face, what did I learn?

Since the elements of the app were predetermined, the challenge was to navigate within the set parameters.
For example when customizing the dialog form asking the user to fill in certain information, only certain form elements were supported by slack (text, textarea, select). So in order to customize the app within the given parameters, it was necessary to consult the "Developer guides and docs" section and only use the elements described there.

Also, the boilerplate did not include any logging. But I was only able to figure out the correct channel IDs for the "WELCOME_CHANNEL" and the internal event planning team's channel "POST_TO_CHANNEL" by adding logging.



## Steps

### 1. Setting up Environment

Create slack workspace, add app, add description and icon
  <img src="https://user-images.githubusercontent.com/99111208/163757072-85d3eecc-5d4a-45bf-9e73-be637a924258.png" alt="Basic information slack app">

### 2. Configure node.js App

* Download existing code
* Install dependencies used
* copy oath token and slack verification token into .env file to keep them secret (file is not published on Github)
* finding out Channel IDs to WELCOME_CHANNEL and POST_TO_CHANNEL via logging
<img src="https://user-images.githubusercontent.com/99111208/163763054-e193eb6f-2ef6-4499-b6bc-ac65a813a77a.png" alt="Logging">

Create app on web server Heroku
* add heroku remote to existing Git repo

```bash
heroku git:remote -a slack-event-app
````
  <img src="https://user-images.githubusercontent.com/99111208/163757076-9d9be979-8e4f-40ae-a29b-b8eabacc5ef3.png" alt="Screenshot confirmation heruku app is running">


### 3. Enable listening for Events

* Add heroku page (https://slack-event-app.herokuapp.com/slack/events) to event subscriptions with toggle on,
* Add event 'member joined channel'

<img src="https://user-images.githubusercontent.com/99111208/163757086-1b2cfa41-14dc-4a9c-8bbc-8db169ef025d.png" alt="Enable Event Subscriptions">

### Event Listener Successful

Interactive message displays to welcome joined member and asks them to fill out form

<img src="https://user-images.githubusercontent.com/99111208/163757081-3b7a33a1-49f3-4a7f-a33e-d234c1c1b285.png" alt="welcome message in chat">

### 4. Install App in workspace to generate tokens

<img src="https://user-images.githubusercontent.com/99111208/163763957-af150796-0fe2-4cd6-ac7d-12e1a02def1c.png" alt="install app to workspace">

### 5. Add permission scope to send an ephemeral message to WELCOME_CHANNEL

<img src="https://user-images.githubusercontent.com/99111208/163764432-43143809-47c8-4bad-99c8-2b44e6f9b7a3.png" alt="required parameters for ephemeral message">

Left Menubar --> Features --> OAuth & Permissions --> Scopes

<img src="https://user-images.githubusercontent.com/99111208/163764761-af1200fb-1c22-46c9-8c02-62a654599bdf.png" alt="add bot token scopes">

### 6. Specify details of form presented to joined members (in index and dialog.js)

### 7. Add URL route for interactive components "https://slack-event-app.herokuapp.com/slack/components”,

Left Menubar --> Features --> Interactivy & Shortcuts

### 8. Handling request to dialog.open 

The method dialog.open requires three arguments (auth token, already implemented), dialog definition in form of a JSON-encoded string and a trigger_id.
In order to generate this id, it is necessary to implement a user trigger to open dialog only when user interaction takes place. The user trigger is created in form of a slash command.

### Successful: New member opens and fills out form

<img src="https://user-images.githubusercontent.com/99111208/163757080-7f2759a7-db33-4b4c-b359-d7f2da4e0722.png" alt="open dialog form in chat">

### 9. Specify arguments to use method chat.postMessage

The API method chat.postMessage sends filled out form to internal events team (Channel: POST_TO_CHANNEL). It takes the arguments token, channel and attachments (or blocks or texts). As attachments I chose the categories "Guest Count", "Dietary Requirements" and preferred "Weekdays" for the party.


### Successful: Form content is posted to separate channel of internal event planning 

<img src="https://user-images.githubusercontent.com/99111208/163757077-73207ac5-5276-4579-b741-dadf0ed3933f.png" alt="internal event planning channel receives result of form submission">


