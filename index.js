import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import apiRouter from "./src/routes/api.js";
import { coverRouter, trackRouter } from "./src/data/files.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


// Allow /public/js and /public/css to be served statically
// This DOES NOT allow to serve files from the /public/views directory
app.use(['^\/public\/views($|\/)', '/public'], express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/public/views", {
    extensions: ["html", "htm"],
}));

// Allow to server bootstrap from /public/(css|js) path
app.use('/public/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/public/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use('/public/covers', coverRouter);
app.use('/public/music', trackRouter);

// Serve * from /singstereo to one of the views
app.use('/singstereo/*', (req, res) => {
    res.sendFile(__dirname + "/public/views/singstereo.html");
});

app.use(express.json())
app.use('/api', apiRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));