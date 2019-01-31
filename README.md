<p align="center"><img width="200" src="static/talq-icon.svg"></h2>
<p align="center">A modern communication platform built with React and GraphQL.</p>

![talq screenshot](.github/screenshot.png)

## Known Issues

### Redirected to error page after signing up

Sometimes, after a user has just signed up with a new account, the user will be redirected
to a page telling them that they are not logged in. 

This seems to happen because for some reason, the "loggedIn" localStorage flag isn't set
correctly.
  
To fix this, the user needs to go back to the login page and login using the details they
just used to create the account.

### Real time functionality not working after signing up

When the above bug doesn't happen, the user will redirected to the main chat page after
signing up. At this point, user's will be able to create chats and send messages, but the
real time functionality won't work. This will mean that the user's app will not be updated
automatically, so they won't see if another user creates a chat with them in it, or sends
a message in a chat the user has created. 

This seems to happen because the GraphQL subscription isn't setup correctly, however from
the debugging I have done, the subscription seems to be ran correctly. 

To fix this, the user needs to refresh the page after signing up. The site will then work
correctly.

## Usage

### **IMPORTANT**

Before running either the development or the production server, it is important
that the Talq API server is running, and a `.env` file has been created in the root
of the project with the following environment variables:

* `API_ENDPOINT` (String) - The regular HTTP endpoint for Talq's API.
* `API_SUBSCRIPTION_ENDPOINT` (String) - The WebSocket subscription endpoint for Talq's API.
* `LOG_APOLLO_ERRORS` (Boolean) - Controls if Apollo errors should be logged.
* `PORT` (Number) - The port to run the development server on.

An example `.env` file can be found at `.env.example`.

If you do not know how to setup Talq's API, head over to the following github
repo, [talq-api](https://github.com/joealden/talq-api).

### Development

To start the development server, run the following commands:

```
yarn
yarn dev
```

### Production

```
yarn
yarn build
yarn start
```
