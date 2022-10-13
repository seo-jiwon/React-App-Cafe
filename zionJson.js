//import * as React  from 'react';
import { React, useEffect, useState, useRef } from "react";
import { Pressable, Image, Text, View, StyleSheet, TextInput, Button, ScrollView, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
//import { Ionicons, AntDesign } from '@expo/vector-icons';

var idTest = 0;
let idClickCnt = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let numArray = [1,2,3,4,5,6,7,8,9];

export default function App() {

  const [isSelect, setSelect] = useState([false, false, false, false, false, false, false, false, false]);
  const [test, setTest] = useState('');
  const [clickNum, setClickNum] =  useState(null);
  const [imageState, setImageState] = useState(require('./images/1.png'));
  const [defaultIcon, setIcon] = useState('minussquareo');
  const [textColor, setTextColor] = useState('black'); // 글자색 상태
  const [colorState, setColorState] = useState('white'); // 배경색 상태
  const [serverState, setServerState] = useState('Loading...'); // 서버 상태 메시지
  const [messageText, setMessageText] = useState(''); // 초기 TextInput 문자 상태
  const [disableButton, setDisableButton] = useState(true); // 초기 버튼 비활성화
  const [inputFieldEmpty, setInputFieldEmpty] = useState(true); // TextInput 비었는지 상태
  const [serverMessages, setServerMessages] = useState([]); // 서버 메시지 리스트
  //var ws = React.useRef(new WebSocket('ws://10.32.15.49:8887')).current;
  // useRef() Hook : current 속성을 가지고 있는 객체 반환 -> ??

  //윤경
  const websocketUrl = 'ws://10.32.14.22:8080';
  //지원
  //const websocketUrl = 'ws://10.32.12.141:8080';
  //지원
  //const websocketUrl = 'ws://127.0.0.1:8080';
  //교수님
  //const websocketUrl = 'ws://10.32.15.47:8080';
  let ws = useRef(null);
  
  // const submitBtn = () => {
  //   idClickCnt[idTest] -= 1;
  //   ws.current.send(idTest+1 +'번 예약 완료!');
  //   Alert.alert('좌석 예약이 완료되었습니다!');
  // }

  //마씨와 서씨 이름+좌석 넣는 곳 
  var ma = '';
  var ma2 = '';
  var zi = '';
  var zi2 = '';
  const revSelect = (id, chResult, sumNumCh, chEndResult) => {
    //지온 사용자가 처음엔 누른 좌석번호와 나중에 누른 좌석번호고 동일할때만 해제되도록


    // 유저 지원
    if ( chResult === 'zion' ) {
      if ( zi === sumNumCh ) { // zi = zion5
        zi2 = sumNumCh; //zi2 = zion5
      }
      else { 
        zi = sumNumCh; // zi = zion5, sumNumCh = zion3 => zi = zion3
      }
    }
    // 유저 윤경
    else if ( chResult === 'mmyg' ) {
      if ( ma === sumNumCh ) {
        ma2 = sumNumCh;
      }
      else {
        ma = sumNumCh;
      }
    }

    if ( zi === zi2 ) {
      isSelect[id-1] = !isSelect[id-1] 
    }
    else if ( ma === ma2 ) {
      isSelect[id-1] = !isSelect[id-1] 
    }
    else {

    }


    // isSelect[id-1] = !isSelect[id-1] 

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
  useEffect(() => {
    if(!ws.current) {
      ws.current = new WebSocket(websocketUrl);
      const serverMessagesList = [];
      // 웹소켓 열리면 서버와 연결되고 비활성화 버튼 false 처리
      ws.current.onopen = () => {
        setServerState('연결 성공 - zion')
        setDisableButton(false);
        ws.current.send('zion 등장');
      };
      // 웹소켓 닫히면 버튼 비활성화 true 처리
      ws.current.onclose = (e) => {
        setServerState('연결 종료 - zion')
        setDisableButton(true);
        ws.current.send('zion 퇴장');
      };
      // 에러 발생 시 에러 메시지
      ws.current.onerror = (e) => {
        setServerState(e.message);
      };
      // 서버 메시지
      ws.current.onmessage = (e) => {
        if(e.data.length !== undefined) {

        // 서버 메시지 리스트에 텍스트 값(스크롤뷰에 작성된)을 넣음
        serverMessagesList.push(e.data);
        setServerMessages([...serverMessagesList]);

        const regex = /[^0-9]/g;
        const result = e.data.replace(regex, "");
        const number = parseInt(result);

        // 사용자 이름 추출
        const ch1 = e.data.charAt(0);
        const ch2 = e.data.charAt(1);
        const ch3 = e.data.charAt(2);
        const ch4 = e.data.charAt(3);

        const chResult = ch1 + ch2 + ch3 + ch4;
        const sumNumCh = chResult + number;

        console.log("사용자: " + chResult);
        console.log("사용자+좌석번호 : " + sumNumCh);


        // 예약 상태 문구 추출
        const chEnd1 = e.data.charAt(15);
        const chEnd2 = e.data.charAt(16);

        const chEndResult = chEnd1 + chEnd2;
        console.log("예약 상태: " + chEndResult);


        // 기존 상태값을 가져올 수 있도록 이게 있어야지 색깔이 왓다갓다가 안댐
        // onmessage에서 바뀔때의 상태를 유지하도록 반복문 쓰던가 부분렌더링이안되서
        revSelect(number, chResult, sumNumCh, chEndResult);
        console.log("zi: " + zi);
        console.log("zi2: " + zi2);


        console.log("첫 글자" + number);

        //if(e.data === '5번 좌석 대기' ){
        if( (number < 10) && (number > 0) ) {
          //console.log('e.data IN');

          // var id = number-1;
          // setSelect([
          //   ...isSelect.slice(0, id),
          //   true,
          //   ...isSelect.slice(id + 1),
          // ]);
      }
      else{
        //console.log('e.data OUT');

        // var id = number-1;
        // setSelect([
        //   ...isSelect.slice(0, id),
        //   false,
        //   ...isSelect.slice(id + 1),
        // ]);

      }
        }
      };
    }
    
  }, [])

  // 버튼 클릭 시 호출되는 함수
  const submitMessage = () => {
    //ws.send('hello zion');
    ws.current.send(messageText); // TextInput에 입력된 값(messageText)을 웹소켓에 전송
    setMessageText('') // TextInput '' 로 변경
    setInputFieldEmpty(true) // TextInput 비어도 된다
  }


  var idNum = 0;
  const getButton = (id) => {
    return (
      <Pressable
        style={[
          styles.buttonContainer,
          {backgroundColor: isSelect[id] ? '#eeceff' : 'white'},
        ]}
        onPress={() => {
          idClickCnt[id] += 1;
          idTest = id; //완료버튼에 클릭한 버튼 번호 전달하기 위해

          if (isSelect[id] === false ) {
            console.log('zion: ' + (id+1) + '번 좌석 예약 완료');
            ws.current.send('zion: ' + (id+1) + '번 좌석 예약 완료');
          }
          else {
            console.log('zion: ' + (id+1) + '번 좌석 예약 취소');
            ws.current.send('zion: ' + (id+1) + '번 좌석 예약 취소');
          }

          // setSelect([
          //   ...isSelect.slice(0, id),
          //   !isSelect[id],
          //   ...isSelect.slice(id + 1),
          // ]);

  //         if(ws.current !== null){
  //           ws.current.send(id.toString());
  //  }
        }}>
        <Text>{id+1}</Text>
      </Pressable>
    );
  };

  //아이콘 변경
  const iconClick = () => {
    setIcon(defaultIcon === 'minussquareo' ? 'closesquare' : 'minussquareo')

  }

  //TouchableOpacity 변경
  // function seatClick(idx) {
  //   return alert(idx);

  //   // setTextColor(textColor === 'black' ? 'white' : 'black');
  //   // setColorState(colorState === 'white' ? 'grey' : 'white');
  //  }

   //이미지 변경
   const imageClick = () => {
    setImageState(imageState === require('./images/1.png') ? require('./images/2.png') : require('./images/1.png'));
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
          {/* {
            seatArray.map((item, idx) => {
              return (
                <TouchableOpacity  key={idx} 
                style={{ backgroundColor:colorState, width: 30, height: 30, marginRight: 10, borderWidth: 1, borderColor: 'grey', 
                borderRadius: 5, marginTop: 20, shadowColor: "#000000",shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 } }}
                  //onPress={seatClick(idx)}  
                //onPress={seatClick}
                  //onPress={()=> {seatClick()}}
                  onPress={()=> {seatClick(idx)}}
                  >
                    <Text key={idx} style={{color:textColor}}>{item}</Text>
                </TouchableOpacity>
              )
            })
          } */}
        {/* </View> */}
        {/* 아이콘 */}
        {/* <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-square-outline" style={{fontSize: 43}} />
          <AntDesign name={defaultIcon} style={{fontSize: 40, marginTop: 3}} onPress={iconClick}/>
          <AntDesign name="closesquare" style={{fontSize: 40, marginTop: 3, marginLeft: 4}} />
        </View> */}

        {/* 이미지 */}
        {/* <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={imageClick}>
            <Image source={imageState}/>
          </TouchableOpacity>
          
          <Image source={require('./images/2.png')}/>
          <Image source={require('./images/3.png')}/>
        </View> */}

        {/* <View style={{marginTop: 100, marginLeft: '37%', width: 100, borderColor: '#89008C', borderWidth: 1, borderRadius: 20,
        shadowColor: "#89008C",shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }}}>
        <Button style={{marginTop: 50}}
          title="완료"
          color="black"
          backgroundColor="pink"
          onPress={submitBtn}
          //onPress={()=> {alert("좌석을 선택해주세요.")}}
          ></Button>
        </View> */}


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
