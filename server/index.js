//모듈 가져오기
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//cors 허용하기
app.use(cors());

const server = http.createServer(app);

//socket io 서버 설정
//localhost:3000 에서 온 cors 허용, method는 get,post
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//io.on("connection", callback) 클라이언트와 서버가 연결되었을 때 발생
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  //socket.on(eventName, callback)
  //클라이언트가 join_room 이벤트를 호출했을 때
  //socket.join : 특정 방이나 채널에 추가하는데 사용된다.
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // socket.to(room).emit(event, data)
  // 특정 방에 있는 모든 클라이언트에게 이벤트와 데이터를 전송하는 데 사용
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
