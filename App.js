import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, ScrollView, Alert, Pressable, SafeAreaView } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function App() {
  
  const [seatClickTable, setSeatClickTable] = React.useState([]); // 클릭한 좌석 정보를 테이블에 저장
  const [serverState, setServerState] = React.useState('Loading...'); // 서버 상태 메시지
  const [messageText, setMessageText] = React.useState(''); // 초기 TextInput 문자 상태
  const [disableButton, setDisableButton] = React.useState(true); // 초기 버튼 비활성화
  // const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true); // TextInput 비었는지 상태
  const [serverMessages, setServerMessages] = React.useState([]); // 서버 메시지 리스트
  const [userTable, setUserTable] = React.useState([]); // 서버에 접속한 사용자(이름) 저장
  const [userTest, setUserTest] = React.useState([]); // 서버에 접속한 사용자(이름) 저장
  const [isSelect, setSelect] = useState([false, false, false, false, false, false, false, false, false]); // 좌석 버튼 상태

  // Websocket URL
  const websocketUrl = 'ws://192.168.35.85:8080';

  var name = '서지원';
  var data = {};
  var sendData = [];

  // useRef() Hook : current 속성을 가지고 있는 객체 반환
  let ws = useRef(null);

  // useEffect() Hook : 컴포넌트가 렌더링 될 때마다 작업을 실행할 수 있도록 하는 Hook
  // useEffect Hook 최초 1회 웹소켓 정의 -> 다른 함수에서 웹소켓 인스턴스 사용x -> useRef 사용
  useEffect(() => {

    if (!ws.current) {
      ws.current = new WebSocket(websocketUrl);
      const serverMessagesList = [];
      const userList = [];

      // 웹소켓 열리면 서버와 연결되고 비활성화 버튼 false 처리
      ws.current.onopen = () => {
        setServerState('연결성공 - 지원')
        setDisableButton(false);
        var data = {};
        var sendData = [];
        data['id'] = name;
        data['req'] = 'con';
        sendData.push(data);
        var jsonData = JSON.stringify(sendData);
        ws.current.send(jsonData);
      };

      // 웹소켓 닫히면 버튼 비활성화 true 처리
      ws.current.onclose = (e) => {

        setServerState('연결 종료 - 지원')
        setDisableButton(true);
      };

      // 에러 발생 시 에러 메시지
      ws.current.onerror = (e) => {
        setServerState(e.message);
      };

      // 서버 메시지
      ws.current.onmessage = (e) => {
        // 서버 메시지 리스트에 텍스트 값(스크롤뷰에 작성된)을 넣음
        serverMessagesList.push(e.data);
        // console.log("서버메시지: " + e.data); // 서버메시지: [{"id":"서지원","req":"res","tnum":0}]
        setServerMessages([...serverMessagesList]);
        // console.log('message');
        jsonRev = JSON.parse(e.data);

        for (var i = 0; i < jsonRev.length; i++) {
          // 예약한 경우
          if (jsonRev[i].req == 'res') {
            revSelect(jsonRev[i].tnum, true);
            resTable(jsonRev[i]); // 아이디, 예약상태, 좌석번호 정보를 전달
            serverMessages
            // 취소한 경우
          } else if (jsonRev[i].req == 'can') {
            revSelect(jsonRev[i].tnum, false);
            canTable(jsonRev[i]);

            // 접속한 경우 - 접속 사용자 확인
          } else if (jsonRev[i].req == 'con') {
            // console.log("아이디는" + jsonRev[i].name);
            userListTable(jsonRev[i]);
          }
        }
      };
    }

  }, [])

  // 좌석 버튼 생성 함수
  const getButton = (id) => {
    // console.log(ws.current);

    return (
      <Pressable
        style={[
          styles.buttonContainer,
          { backgroundColor: isSelect[id] ? '#eeccff' : 'white' },
        ]}
        onPress={() => {
          // console.log('onPress');
          // console.log(isSelect[0]);

          // 예약
          if (isSelect[id] == false) {
            Alert.alert(
              id + 1 + "번 좌석을 예약하시겠습니까?",   // 타이틀
              "",                                // 소제목
              [                                  // 버튼 배열
                {
                  text: "아니요",                              // 버튼 제목
                  // onPress: () => console.log("예약 아니요"),    //onPress 이벤트시 콘솔창에 로그를 찍는다
                  style: "cancel"
                },
                {
                  text: "네", onPress: () => {
                    if (ws.current !== null) {
                      // var data = {};
                      // var sendData = [];
                      data['id'] = name;
                      if (isSelect[id] == false) {
                        data['req'] = 'res';
                      } else {
                        data['req'] = 'can';
                      }
                      data['tnum'] = id;
                      sendData.push(data);
                      var jsonData = JSON.stringify(sendData);
                      ws.current.send(jsonData);
                    }
                  }
                },
              ],
              { cancelable: false }
            );
          }
          // 예약 취소
          else {
            Alert.alert(
              id + 1 + "번 좌석을 예약 취소 하시겠습니까?", // 타이틀
              "",                                   // 소제목
              [                                     // 버튼 배열
                {
                  text: "아니요",                                   // 버튼 제목
                  // onPress: () => console.log("예약 취소 아니요"),     //onPress 이벤트시 콘솔창에 로그를 찍는다
                  style: "cancel"
                },
                {
                  text: "네", onPress: () => {
                    if (ws.current !== null) {
                      // 클릭한 좌석 정보를 테이블에 담은 길이만큼 돌 때
                      for (var i = 0; i < seatClickTable.length; i++) {
                        // 저장된 좌석번호 중 하나와 지금 클릭한 아이디(좌석번호)가 같을때
                        if (seatClickTable[i].tnum == id) {
                          // 저장된 아이디(사용자이름) 중 하나와 지금 클릭한 사용자이름이 같을때
                          if (seatClickTable[i].id == name) {
                            var data = {};
                            var sendData = [];
                            data['id'] = name;
                            if (isSelect[id] == false) {
                              data['req'] = 'res';
                            } else {
                              data['req'] = 'can';
                            }
                            data['tnum'] = id;
                            sendData.push(data);
                            var jsonData = JSON.stringify(sendData);
                            ws.current.send(jsonData);

                            break;
                          }
                          else {
                            alert('본인이 예약한 좌석이 아닙니다.');
                            break;
                          }
                        }
                      }
                    }
                  }
                },
              ],
              { cancelable: false }
            );
          }
        }}>
        <Text>{id + 1}</Text>
      </Pressable>
    );
  };

  // 예약 및 예약취소 시 색상 변경 (좌석번호, 예약상태)를 받아옴)
  const revSelect = (id, flag) => {
    isSelect[id] = flag;
    setSelect([
      isSelect[0],
      isSelect[1],
      isSelect[2],
      isSelect[3],
      isSelect[4],
      isSelect[5],
      isSelect[6],
      isSelect[7],
      isSelect[8],
    ]);
  }

  // 예약 시 jsonRev로 3개 정보(사용자, 예약상태, 좌석번호)를 인자로 담아옴
  // 예약 시 클릭한 좌석 정보를 seatClickTable 테이블 변수에 담아서 저장함.
  const resTable = (jsonRev) => {
    // server_json.js 파일에 예약 경우 부분과 동일(서버에서 req='res'인 경우 저장하는 부분)
    tableInfo = {};
    tableInfo['tnum'] = jsonRev.tnum;
    tableInfo['id'] = jsonRev.id;
    tableInfo['req'] = jsonRev.req;

    // 내가 만든 클릭한 좌석 정보를 담을 테이블 변수에 클릭한 사용자이름, 예약, 좌석 번호의 정보를 담는다
    seatClickTable.push(tableInfo);
  }

  // 취소 시 jsonRev로 3개 정보(사용자, 예약상태, 좌석번호)를 인자로 담아옴
  // 취소 시 클릭한 좌석 정보를 seatClickTable 테이블에서 제거한다.
  const canTable = (jsonRev) => {
    // server_json.js 파일에 취소 경우 부분과 동일(서버에서 req='can'인 경우 저장하는 부분)
    for (var i = 0; i < seatClickTable.length; i++) {
      if (seatClickTable[i].tnum == jsonRev.tnum) {
        seatClickTable.splice(i, 1);
        break;
      }
    }
  }

  const userListTable = (jsonRev) => {
    userName = {};
    userName['name'] = jsonRev.name;
    userName['req'] = jsonRev.req;

    userTest.push("" + userName.name);
    // console.log("사용자리스트" + userTest);
    setUserTest([...userTest]);

  }

  // 서버 메시지 전송 버튼을 클릭하는 경우 호출되는 함수
  const submitMessage = (e) => {
    ws.current.send(messageText);
    // console.log();
  }

  return (
    <View>
      {/* 서버 연결 상태를 알려주는 View */}
      <View
        style={{
          height: 70, backgroundColor: '#7B08FF', padding: 5, justifyContent: "center",
          shadowColor: "#000000", shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }
        }}
      >
        <Text style={{ marginTop: 40, color: 'white' }}>{serverState}</Text>
      </View>

      {/* 서버에 접속한 사용자(이름)을 버튼으로 생성 */}
      {/* <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginTop: 14, marginLeft: 10,fontSize: 17}}>접속자</Text> */}

        {/* 접속한 사용자 이름 불러오는 곳 */}
        {/* {
          userTest.map((item, ind) => {
            return (
              <TouchableOpacity key={ind} style={{ marginTop: 7.5, marginLeft: 10, backgroundColor: "#eeceff", borderRadius: 5 }}>
                <Text style={{ fontSize: 17, color: '#89008C', padding: 5 }}>{item}</Text>
              </TouchableOpacity>
            )
          })}

      </View> */}

      {/* 서버 메시지를 나타내는 View */}
      <View
        style={{
          margin: 5, marginTop: 5, borderRadius: 5, borderWidth: 1, borderColor: 'grey',
          padding: 5, height: 300,
        }}>
        <Text style={{ color: 'grey' }}>서버메시지</Text>
        <ScrollView>
          {
            serverMessages.map((item, ind) => {
              return (
                <Text key={ind}>{item}</Text>
              )
            })
          }
        </ScrollView>
      </View>

      {/* 카페 View */}
      <View style={{
        flexGrow: 4,
      }}>

        {/* 카페 타이틀 View */}
        <View style={{
          backgroundColor: "#eeceff", height: 50, fontSize: 30, margin: 5,
          justifyContent: 'center', borderRadius: 20,
          shadowColor: "#89008C", shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }
        }}>
          <Text style={{ margin: 5, color: "#89008C", fontSize: 30, fontWeight: "bold", paddingLeft: 5 }}>
            Cafe
          </Text>
        </View>

        {/* 카페 좌석 View1 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>

          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
        </View>

        {/* 카페 좌석 View2 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
          {getButton(3)}
          {getButton(4)}
          {getButton(5)}
        </View>

        {/* 카페 좌석 View3 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
          {getButton(6)}
          {getButton(7)}
          {getButton(8)}
        </View>
      </View>
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    padding: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 5,
    marginLeft: 15,
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: 'white',
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
  },
});