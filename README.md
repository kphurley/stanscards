# Stanscards

## Installation

- `git clone`
- `cd stanscards`
- `npm install`
- `npm run proxy` (See below note)
- `npm start`
- visit `http://localhost:8080/`

## Workign with marvelcdb.com - `npm run proxy`

In order to get around CORS issues, we need to proxy requests to marvelcdb.com.  To do this, we're using a library called local-cors-proxy.

To make API calls to marvelcdb resolve when running the project locally, we need to make sure this proxy service is running before we start the app, otherwise certain data fetches we need from the API to set all of the information up won't resolve properly
