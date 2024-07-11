import config from "./config/index.js";
import connectDB from "./config/db.js";
import http from "http"
import { app } from './app.js'
import socketHandler from "./socket.js"


let server = http.createServer(app)

socketHandler(server)

connectDB()
    .then(() => {
        server.listen(config.port, () => {
            console.log(`⚙️ Socket and Server is running at port : ${config.port}`);
            console.log(config);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })