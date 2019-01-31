<p align="center"><img width="200" src="static/talq-icon.svg"></h2>
<p align="center">A modern communication platform built with React and GraphQL.</p>

![talq screenshot](.github/screenshot.png)

## Usage

### **IMPORTANT**

Before running either the development or the production server, it is important
that the Talq API server is running, and a `.env` file has been created in the root
of the project with the following environment variables:

* `API_ENDPOINT` (String) - The regular HTTP endpoint for Talq's API.
* `API_SUBSCRIPTION_ENDPOINT` (String) - The WebSocket subscription endpoint for Talq's API.
* `LOG_APOLLO_ERRORS` (Boolean) - Controls if Apollo errors should be logged.
* `PORT` (String) - The port to run the development server on.

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
