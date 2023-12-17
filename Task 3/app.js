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

const port = 5001;

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

async function handle_query(input_url) {
    let movie_urls = []; // List of movies in the pod

    // Query to get movie URLs
    await engine.queryBindings(`
        PREFIX schema: <http://schema.org/>
        SELECT ?movie WHERE {
            ?movie a schema:Movie .
        }
    `, { sources: [input_url] }).then(async function (bindingsStream) {
        bindingsStream.on('data', function (data) {
            movie_urls.push(data.get('movie').value);
        });

        // Wait for the first query to complete
        await new Promise(resolve => bindingsStream.on('end', resolve));

        // Query each movie URL for details
        for (const movie_url of movie_urls) {
            await engine.queryBindings(`
                PREFIX schema: <http://schema.org/>
                SELECT ?name ?image WHERE {
                    <${movie_url}> schema:name ?name;
                                  schema:image ?image .
                }
            `, { sources: [movie_url] }).then(function (bindingsStream) {
                bindingsStream.on('data', function (data) {
                    let obj = {
                        "name": data.get('name').value,
                        "image": data.get('image').value
                    };
                    io.emit('update', {'message': obj});
                });
            });
        }
    });
}

httpServer.listen(port, () => {
    console.log("Server is running on port " + port);
});
