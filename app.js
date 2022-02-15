const express = require("express");

const socket = require("socket.io");

const http = require("http");
const fs = require("fs");

const app = express();

const server = http.createServer(app);

//생성된 서버에 sokect 을 바인딩
const io = socket(server);

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));

app.get("/", (req, res) => {
  fs.readFile("./static/index.html", (err, data) => {
    if (err) {
      res.send("에러");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

//소켓 관련
io.sockets.on("connection", (socket) => {
  //새로운 유저 접속
  socket.on("newUser", (name) => {
    const message = `${name}님이 접속하셨습니다.`;
    console.log(message);

    //소켓 객체에 이름 저장
    socket.name = name;

    //모든 소켓에게 전송
    io.sockets.emit("update", {
      type: "connect",
      name: "SERVER",
      message: message,
    });
  });

  //전송한 메세지 받기
  socket.on("message", (data) => {
    //data에 누가 이름을 받았는지 추가
    data.name = socket.name;

    //보낸 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", () => {
    const message = `${socket.name}님이 나가셨습니다.`;
    console.log(message);
    //모든 소켓에게 전송
    io.sockets.emit("update", {
      type: "disconnect",
      name: "SERVER",
      message: message,
    });
  });
});

server.listen(8080, () => {
  console.log("서버를 실행중입니다.");
});
