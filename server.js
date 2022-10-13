//소켓 생성 npm install ws
// 데몬으로 서버는 계속 기다리면서 포켓을 8080으로 설정
var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({port: 8080});
    CLIENTS=[]; //접속자 serial을 담을 배열
wss.on('connection', function(ws) {
    CLIENTS.push(ws);
    ws.on('message', function(message) {
        console.log('received: %s', message); 
        sendAll(message); //전부 보내줌, 자신에게도 -> 자신을 제외할려면 ws.sendAll
    });
    ws.send("NEW USER JOINED");
});
//클라이언트 배열만큼 돌면서 send
function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].send(''+ message);
    }
}