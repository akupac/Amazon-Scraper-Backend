# Readme

This is a simple API that extracts products from an Amazon search results page. It receives a keyword as a query parameter and returns a JSON object with the products found. The products information includes title, image URL, rating and number of reviews. This is the backend of a project that was designed to interact with a Vite app in the frontend.

Link to frontend repository: [Amazon-Scraper-Front-End](https://github.com/akupac/Amazon-Scraper-Front-End)

## Install

`npm install`

## Config

The scraper uses the port 3000 and has the default frontend url as `http://localhost:5173`, but you can personalize it. Todo so, create a .env file to config port and front end URL. Example:

```
VITE_API_URL = "http://localhost:5230"
API_PORT = 3030
```

## Use

To run the API, just type in the root directory:

`bun run src/index.js`

### Endpoint

The only endpoint available is `GET /scrape?keyword=<keyword>`. It expects a keyword as a query parameter and returns a JSON object with the products found.
