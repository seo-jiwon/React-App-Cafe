// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import * as React from 'react';
import {useRef, useEffect} from 'react';
import  {useState} from 'react';
import { Text, View, StyleSheet, TextInput, Button, ScrollView, Alert ,Pressable, SafeAreaView} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';



export default function App() {
  const [serverState, setServerState] = React.useState('Loading...'); // 서버 상태 메시지
  const [messageText, setMessageText] = React.useState(''); // 초기 TextInput 문자 상태
  const [disableButton, setDisableButton] = React.useState(true); // 초기 버튼 비활성화
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true); // TextInput 비었는지 상태
  const [serverMessages, setServerMessages] = React.useState([]); // 서버 메시지 리스트
  const inputRef = React.useRef(null);
  //var ws = React.useRef(new WebSocket('ws://10.32.15.49:8887')).current;
  // useRef() Hook : current 속성을 가지고 있는 객체 반환 -> ??

  //const websocketUrl = 'ws://10.32.15.49:8800';
  const websocketUrl = 'ws://172.30.1.81:8080';
  let ws = React.useRef(null);  
  const [isSelect, setSelect] = useState([false, false, false]);
  var name = '김용권';
  
  const getButton = (id) => {
    console.log(ws.current);
   
    return (
      <Pressable
        style={[
          styles.buttonContainer,
          {backgroundColor: isSelect[id] ? 'green' : 'yellow'},
        ]}
        onPress={() => {
          console.log('onPress');
          console.log(isSelect[0]);
          console.log(isSelect[1]);
          console.log(isSelect[2]);
        //   isSelect[id] = !isSelect[id] 
        // setSelect([
        //     isSelect[0],
        //     isSelect[1],
        //     isSelect[2],
        //   ]);
           if(ws.current !== null){
            
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
    }
        }}>
        <Text>Color Change Button</Text>
      </Pressable>
    );
  };
  const revSelect = (id,flag) => {
    console.log(isSelect[0]);
    console.log(isSelect[1]);
    console.log(isSelect[2]);
    isSelect[id] = flag; 
    setSelect([
       isSelect[0],
       isSelect[1],
       isSelect[2],
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
        setServerState('Connected to the server - zion')
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
      
        setServerState('. Check internet or server. - zion')
        setDisableButton(true);
      };
      // 에러 발생 시 에러 메시지
      ws.current.nerror = (e) => {
        setServerState(e.message);
      };
      // 서버 메시지
      ws.current.onmessage = (e) => {
        // 서버 메시지 리스트에 텍스트 값(스크롤뷰에 작성된)을 넣음
        serverMessagesList.push(e.data);
        console.log(e.data);
        setServerMessages([...serverMessagesList]);
        console.log('message');
        jsonRev = JSON.parse(e.data);
        for(var i =0 ; i< jsonRev.length;i++){
          if(jsonRev[i].req == 'res'){
            revSelect(jsonRev[i].tnum,true);
          }else if(jsonRev[i].req == 'can'){
            revSelect(jsonRev[i].tnum,false);
          }
        }
       /* var testString =e.data;   // 원래 문자열
        var regex = /[^0-9]/g;            // 숫자가 아닌 문자열을 선택하는 정규식
        var result = testString.replace(regex, "");   */

       
      };
    }
    
  }, [])
  // 버튼 클릭 시 호출되는 함수
  

  const submitMessage = (e) => {
    ws.current.send(messageText);
    console.log(  );    
   // document.getElementById("b").color="red";
   /* ws.current.send(messageText); // TextInput에 입력된 값(messageText)을 웹소켓에 전송
    setMessageText('') // TextInput '' 로 변경
    setInputFieldEmpty(true) // TextInput 비어도 된다*/
  //  Alert.alert('좌석 예약이 완료되었습니다!');
  
  }
  return (
    <View style={styles.container}>
      <View style={{
        height: 70,
        backgroundColor: '#eeceff',
        padding: 5,
        justifyContent: "center"
      }}>
        <Text style={{ marginTop: 40}}>{serverState}</Text>
      </View>
      <View style={{
        backgroundColor: '#ffeece',
        padding: 5,
        height: 250
      }}>
        <Text>서버메시지</Text>
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
      }}>
        <TextInput style={{
            borderWidth: 1,
            borderColor: 'black',
            flexGrow: 1,
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
        <Button id="b" ref={inputRef}  color='blue'
         onPress={submitMessage}
         title='mit'
         
        />
      </View>
      <View>{getButton(0)}
      {getButton(1)}
      {getButton(2)}
      </View>



    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 10,
    padding: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50,
    borderRadius: 30,
    marginBottom: 15,
  },
});