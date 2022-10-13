import * as React from 'react';
import {useRef, useEffect} from 'react';
import  {useState} from 'react';
import { Text, View, StyleSheet, TextInput, Button, ScrollView, Alert ,Pressable, SafeAreaView} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';



export default function App() {
  const [seatClickTable, setSeatClickTable] = React.useState([]); // 클릭한 좌석 정보를 테이블에 저장
  const [serverState, setServerState] = React.useState('Loading...'); // 서버 상태 메시지
  const [messageText, setMessageText] = React.useState(''); // 초기 TextInput 문자 상태
  const [disableButton, setDisableButton] = React.useState(true); // 초기 버튼 비활성화
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true); // TextInput 비었는지 상태
  const [serverMessages, setServerMessages] = React.useState([]); // 서버 메시지 리스트
  const inputRef = React.useRef(null);
  //var ws = React.useRef(new WebSocket('ws://10.32.15.49:8887')).current;
  // useRef() Hook : current 속성을 가지고 있는 객체 반환 -> ??

  //윤경
  //const websocketUrl = 'ws://10.32.14.112:8080';
  //지원
  const websocketUrl = 'ws://10.32.12.158:8080';
  //지원
  //const websocketUrl = 'ws://127.0.0.1:8080';
  //교수님
  //const websocketUrl = 'ws://172.30.1.81:8080';

  let ws = React.useRef(null);  
  const [isSelect, setSelect] = useState([false, false, false, false, false, false, false, false, false]);
  var name = '서지원';
  var data = {};
  var sendData = [];

  const getButton = (id) => {
    console.log(ws.current);
   
    return (
      <Pressable
        style={[
          styles.buttonContainer,
          {backgroundColor: isSelect[id] ? '#eeccff' : 'white'},
        ]}
        onPress={() => {
          console.log('onPress');
          // console.log(isSelect[0]);

          //예약
          if ( isSelect[id] == false ) {
            Alert.alert(
              id+1 + "번 좌석을 예약하시겠습니까?", // 타이틀
              "",                             // 소제목
              [                              // 버튼 배열
                {
                  text: "아니요",                              // 버튼 제목
                  onPress: () => console.log("예약 아니요"),     //onPress 이벤트시 콘솔창에 로그를 찍는다
                  style: "cancel"
                },
                { text: "네", onPress: () => 
                  {
                    if(ws.current !== null){
                            // var data = {};
                            // var sendData = [];
                            data['id'] = name;
                            if(isSelect[id] == false){
                            data['req'] = 'res';
                            }else{
                              data['req'] = 'can';
                            }
                            data['tnum'] = id;
                            sendData.push(data);
                            var jsonData =JSON.stringify(sendData);
                            ws.current.send(jsonData);
                    }
                  }
                },
                                                                      // 이벤트 발생시 로그를 찍는다
              ],
              { cancelable: false }
            );
          } 
          // 예약 취소
          else {
            Alert.alert(
              id+1 + "번 좌석을 예약 취소 하시겠습니까?", // 타이틀
              "",                             // 소제목
              [                              // 버튼 배열
                {
                  text: "아니요",                              // 버튼 제목
                  onPress: () => console.log("예약 취소 아니요"),     //onPress 이벤트시 콘솔창에 로그를 찍는다
                  style: "cancel"
                },
                { text: "네", onPress: () => 
                  {
                    if(ws.current !== null){
                      for(var i=0; i<seatClickTable.length; i++) {
                        if(seatClickTable[i].tnum == id) {
                          if(seatClickTable[i].id == name) {
                            var data = {};
                            var sendData = [];
                            data['id'] = name;
                            if(isSelect[id] == false){
                            data['req'] = 'res';
                            }else{
                              data['req'] = 'can';
                            }
                            data['tnum'] = id;
                            sendData.push(data);
                            var jsonData =JSON.stringify(sendData);
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
        <Text>{id+1}</Text>
      </Pressable>
    );
  };

  const revSelect = (id,flag) => {
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

  // 컴포넌트가 렌더링 될 때마다 작업을 실행할 수 있도록 하는 Hook
  // useEffect Hook 최초 1회 웹소켓 정의 -> 다른 함수에서 웹소켓 인스턴스 사용x -> useRef 사용
  React.useEffect(() => {
   
    if(!ws.current) {
      ws.current = new WebSocket(websocketUrl);
      const serverMessagesList = [];
      // 웹소켓 열리면 서버와 연결되고 비활성화 버튼 false 처리
      ws.current.onopen = () => {
        setServerState('연결성공 - 지원')
        setDisableButton(false);
        var data = {};
        var sendData = [];
        data['id'] = name;
        data['req'] = 'con';
        sendData.push(data);
        var jsonData =JSON.stringify(sendData);
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
        console.log("서버메시지: " + e.data);
        setServerMessages([...serverMessagesList]);
        console.log('message');
        jsonRev = JSON.parse(e.data);

        for(var i =0 ; i< jsonRev.length;i++){
          if(jsonRev[i].req == 'res'){
            revSelect(jsonRev[i].tnum,true);
            resTable(jsonRev[i]); //3개정보
          }else if(jsonRev[i].req == 'can'){
            revSelect(jsonRev[i].tnum,false);
            canTable(jsonRev[i]);
          }
        }



       /* var testString =e.data;   // 원래 문자열
        var regex = /[^0-9]/g;            // 숫자가 아닌 문자열을 선택하는 정규식
        var result = testString.replace(regex, "");   */
      };
    }
    
  }, [])

  const resTable = (jsonRev) => {
    tableInfo= {};
    tableInfo['tnum'] = jsonRev.tnum;
    tableInfo['id'] = jsonRev.id;
    tableInfo['req'] = jsonRev.req;
    seatClickTable.push(tableInfo);
  }

  const canTable = (jsonRev) => {
    for (var i=0; i<seatClickTable.length; i++) {
      if(seatClickTable[i].tnum == jsonRev.tnum){
        seatClickTable.splice(i,1);
        break;
      }
    }
  }

  // 버튼 클릭 시 호출되는 함수
  
  const submitMessage = (e) => {
    ws.current.send(messageText);
    console.log();    
   // document.getElementById("b").color="red";
   /* ws.current.send(messageText); // TextInput에 입력된 값(messageText)을 웹소켓에 전송
    setMessageText('') // TextInput '' 로 변경
    setInputFieldEmpty(true) // TextInput 비어도 된다*/
  //  Alert.alert('좌석 예약이 완료되었습니다!');
  
  }
  return (
    <View>
      <View style={{
        height: 70,
        backgroundColor: '#7B08FF',
        padding: 5,
        justifyContent: "center",
        shadowColor: "#000000",shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }
      }}>
        <Text style={{ marginTop: 40, color: 'white'}}>{serverState}</Text>
      </View>
      <View style={{
        margin: 5,
        marginTop: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 5,
        height: 300,
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
      
      <View style={{
        flexDirection: 'row',
        marginTop: 5
      }}>
        <TextInput style={{
            borderWidth: 1,
            borderRadius: 3,
            borderColor: 'grey',
            flexGrow: 1,
            margin: 5,
            padding: 5,
            height: 50,
            backgroundColor: 'white'
          }} 
          placeholder={'메시지를 작성하세요'} 
          onChangeText={text => {
            setMessageText(text)
            setInputFieldEmpty(text.length > 0 ? false : true)  
          }}
          value={messageText}
         />
        <Button
         onPress={submitMessage}
         title={'Submit'} 
         disabled={disableButton || inputFieldEmpty}
        />
      </View>

      <View style={{
        flexGrow: 4,
      }}>
        <View style={{ 
          backgroundColor: "#eeceff", color: "white", height: 50, fontSize: 30, margin: 5,
          justifyContent: 'center', borderWidth: 1, borderRadius: 20, borderColor:  "#eeceff",
          shadowColor: "#89008C",shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }  }}>
          <Text style={{ margin: 5, color: "#89008C", fontSize: 30, fontWeight: "bold", paddingLeft: 5 }}>
            Cafe
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}> */}
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}> */}
          {getButton(3)}
          {getButton(4)}
          {getButton(5)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}> */}
          {getButton(6)}
          {getButton(7)}
          {getButton(8)}
          </View>
      </View>
    </View>
  );
}
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