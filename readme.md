# Kräftskiva stoplight server and client

## Backend

Graphql Server that handles the stoplight, count downs to next green light and can be reset.

Installation
```
cd backend
yarn
yarn watch
```

This will start a graphql server on  `http://localhost:8981/`

## Frontend Client

Web client that connects to the backend to enable changing the lights

Installation
```
cd frontend
yarn
yarn start
```

This will start the client on `http://localhost:3000`

If you need to change the IP and Port of the graphql server, it is done in `./frontend/src/App.js`

## Light configuration

In Telldus configuration add "red" and "green" anywhere in the name and this app will discover the lights by name.

Copy backend/config-template.js into your config and add your tokens from Tellduslive
`cp backend/config-template.js backend/config.js`
