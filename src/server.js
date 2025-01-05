const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/songs", async (req, res) => {
    let songs = await fs.readdir("../public/songs");
    res.json(songs.map(
        (file_name) => {return {file_name: file_name, name: file_name.split(".")[0]}})
    );
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
