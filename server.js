// 소켓 생성 npm install ws
// 데몬으로 서버는 계속 기다리면서 포켓을 8080으로 설정
var WebSocketServer = require('ws').Server; 
    wss = new WebSocketServer({port: 8080});
    var CLIENTS=[];         // 접속자 serial을 담을 배열
    var tables = [];        // 테이블 정보를 담을 배열
    var userTables = [];    // 사용자 정볼를 담을 배열
   
wss.on('connection', function(ws) {
   // CLIENTS.push(ws);
    ws.on('message', function(message) {
        console.log('received: %s', message); 
        var jsonData = JSON.parse(message);
        console.log(jsonData[0].id);       
        console.log(jsonData[0].req);
        
        if(jsonData[0].req == 'con'){

            // 사용자를 담을 userName 생성
            userName = {};
            userName['name'] = jsonData[0].id;
            userName['req'] = jsonData[0].req;
            userTables.push(userName);
            sendAllExceptMe(message, ws);       // 자신을 제외한 사용자들에게 전송

            ws.id = jsonData[0].id; 
            CLIENTS.push(ws);

            ws.send(JSON.stringify(userTables));
            ws.send(JSON.stringify(tables));
            sendAllExceptMe(message, ws);
        }else if(jsonData[0].req == 'res'){
            tableInfo= {};
            tableInfo['tnum'] = jsonData[0].tnum;
            tableInfo['id'] = jsonData[0].id;
            tableInfo['req'] = jsonData[0].req;
            tables.push(tableInfo);
            console.log("res" + tables);
            sendAll(message);                   // 자신을 포함한 모든 사용자에게 전송
        }else if(jsonData[0].req == 'can'){
            for (var i=0; i<tables.length; i++) {
                if(tables[i].tnum == jsonData[0].tnum){
                        tables.splice(i,1);
                        break;
                }
            }
            sendAll(message);
        }else{
            sendAll(message);
        }
    });

    ws.on('close', function(message) {
        for (var i=0; i<CLIENTS.length; i++) {
            if(CLIENTS[i].id == ws.id){
              CLIENTS.splice(i,1);
             break;
            }
       } 

       for (var i=0; i<userTables.length; i++) {
        if(userTables[i].id == ws.id){
            userTables.splice(i,1);
           break;
          }
       }
    });
});

// 자신을 포함한 모두에게 전송
function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        console.log("클라이언트 " + CLIENTS[i].id); // userName
        CLIENTS[i].send("" + message);
    }
}

// 자신을 제외한 모두에게 전송
function sendAllExceptMe (message, ws) {
    for (var i=0; i<CLIENTS.length; i++) {
        if(CLIENTS[i] != ws){
            console.log("클라이언트 " + CLIENTS[i].id); // userName
            CLIENTS[i].send("" + message);
        }
    }
}