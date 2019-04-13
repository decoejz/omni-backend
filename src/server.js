const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
    socket.on("connectRoom", box => {
        socket.join(box);
    })
});

const DB_USER = process.env.DB_USER||'rocketseat'
const DB_PASS = process.env.DB_PASS||'rocketseat'
mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-jpzec.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true }
);

app.use((req, res, next) => {
    req.io = io;

    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necessario para upload de arquivos - precisa para esse projeto
app.use("/files", express.static(path.resolve(__dirname,"..","tmp")));

app.use(require("./routes"));

server.listen(process.env.PORT || 3333);