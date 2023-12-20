const express = require("express");
const cors = require('cors');
const app = express();
const http = require('http');
const path = require('path');
const httpServer = http.Server(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const engine = new QueryEngine();

const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/movies', (req, res) => {
    let input_url = req.query.url;
    console.log("input url: ", input_url);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, 'index.html'));
    handle_query(input_url);
});

// This is the link to the pod containing the movies and should be
// entered in the search bar: https://solid.interactions.ics.unisg.ch/teofieldmarsham/movies/
async function handle_query(input_url) {
    let movie_urls = [];

    // Calls countMovies to get the number of movies and print it in the console
    const movieCount = await countMovies(input_url);
    console.log("Total number of movies: ", movieCount);

    // First query to fetch the URLs of all items in the container
    await engine.queryBindings(`
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?movie WHERE {
            ?container ldp:contains ?movie .
        }
    `, { sources: [input_url] }).then(async function (bindingsStream) {
        // Process each binding and push movie URLs to the array
        bindingsStream.on('data', function (data) {
            movie_urls.push(data.get('movie').value);
        });

        // Wait for the stream of data to end
        await new Promise(resolve => bindingsStream.on('end', resolve));

        // Second query to fetch the name and image of each movie
        await engine.queryBindings(`
            PREFIX schema: <https://schema.org/>
            SELECT ?name ?image WHERE {
                ?movie schema:name ?name;
                       schema:image ?image .
            }
        `, { sources: movie_urls }).then(function (bindingsStream) {
            console.log("Movie URLs: ", movie_urls); // This line prints the fetched movies URLs

            // Process each binding to extract movie details
            bindingsStream.on('data', function (data) {
                let obj = {
                    "name": data.get('name').value,
                    "image": data.get('image').value
                };
                io.emit('update', {'message': obj}); // Emit the movie details to the client
            });
        });
    });
}

// Additional feature and SPARQL query to find the number of movies
// contained within the pod.
async function countMovies(input_url) {
    let count = 0;

    await engine.queryBindings(`
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT (COUNT(?movie) AS ?count) WHERE {
            ?container ldp:contains ?movie .
        }
    `, { sources: [input_url] }).then(function (bindingsStream) {
        return new Promise((resolve, reject) => {
            bindingsStream.on('data', function (data) {
                count = parseInt(data.get('count').value);
            });
            bindingsStream.on('end', () => resolve(count));
            bindingsStream.on('error', reject);
        });
    });

    return count;
}


httpServer.listen(port, () => {
    console.log("Server is running on port " + port);
});
