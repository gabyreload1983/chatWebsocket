import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import moment from "moment";

const app = express();
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("listen on port 8080"));

const io = new Server(server);

const messages = [];
console.log(messages);

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    data.time = moment().format(`HH:mm:ss`);
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  socket.on("authenticated", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });
});
