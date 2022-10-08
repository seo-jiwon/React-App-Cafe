const express = require("express");
const app = express();
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8001 });

// 웹소켓 서버 연결 이벤트 바인드
wss.on("connection", (ws) => {
  // 데이터 수신 이벤트 바인드
  ws.on("message", (data) => {
    console.log(`Received from user: ${data}`);
  });
});

app.use(express.static("public"));
app.listen(8000, () => {
  console.log(`Example app listening on localhost:8000`);
});