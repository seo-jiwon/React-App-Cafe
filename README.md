# :bulb: Cafe 좌석 예약 애플리케이션

> 프로젝트 기간 : 2022.10.04(화) ~ 2022.10.18(화)
<div align="center">
  <img width="227" alt="image" src="https://user-images.githubusercontent.com/59152019/221555088-35ec1129-32e9-47e4-bbda-45530b6510aa.png">
</div>
<br/>

<b>Cafe는 실시간으로 카페 좌석을 예약하고 여석을 확인하는 애플리케이션</b>  
<br/>

## :question: 프로젝트 계획 이유
- 인기 카페, 점심 시간 등 자주 이용하는 시간대 이용 시 좌석 부족으로 인한 시간 낭비
- 카페 이용자들의 불편함을 줄이고 편리함 제공

<br/>

## :clipboard: 담당 업무
> 페이지 구성 및 기능(DB 데이터 전송 및 가져오기 등)을 담당했습니다.  
1. Cafe 좌석 생성  
2. 실시간 좌석 예약 및 여석 확인
3. 좌석 예약 취소  
    <b>다른 사용자가 예약한 좌석은 취소 할 수 없도록</b> 설정했습니다.
4. 실시간 서버 메시지 확인
5. WebSocket 서버 구축

<br/>

## :link: 실행 방법

- 프로그램 실행
```
$ npm install
```
```
$ npm start
```
명령어를 이용하여 프로그램을 실행한 후  
가상디바이스 실행 또는 Expo App 설치 후 QR인식  
<br/>
- 서버 실행
```
$ node server.js
```
<br/>
<br/>

## :books: 사용 라이브러리
<img src="https://img.shields.io/badge/Expo-000020??style=flat-square&logo=Expo&logoColor=white"/>
<br/>
<br/>

## :file_folder: 개발 환경
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC??style=flat-square&logo=Visual Studio Code&logoColor=white"/> <img src="https://img.shields.io/badge/Xcode-147EFB??style=flat-square&logo=Xcode&logoColor=white"/>
<br/>
<br/>

## :hammer: 기술 스택
<img src="https://img.shields.io/badge/HTML5-E34F26??style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6??style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E??style=flat-square&logo=JavaScript&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB??style=flat-square&logo=React&logoColor=white"/> 
<br/>
<br/>

## :eyes: 기능 설명
기능|APP 접속|좌석 예약|다른 사용자 좌석 예약|
|------|---|---|---|
|화면|<p align="center"><img width="250" height="500" src="https://user-images.githubusercontent.com/59152019/205920717-1d651a03-6c5b-4371-bfc2-c043a0727b15.gif" /></p>|<p align="center"><img width="250" height="500" src="https://user-images.githubusercontent.com/59152019/205920726-c3137965-1b89-432e-b86c-5e6a70309f7f.gif" /></p>|<p align="center"><img width="250" height="500" src="https://user-images.githubusercontent.com/59152019/205920749-99eb3d87-9dff-4f0d-abb1-fe3e6e8724b9.gif" /></p>|
|설명|APP 접속 시 서버 메시지에 접속한 사용자 정보가 나타난다.|카페 좌석 예약 시 Alert창으로 예약 여부를 묻고 예약이 가능하다.<br/> 서버 메시지에 예약 정보가 나타난다.|다른 사용자가 카페 좌석 예약하는 것도 실시간으로 화면에 표시되는 것을 확인 할 수 있다.<br/> 서버 메시지에 다른 사용자의 예약 정보를 확인할 수 있다.|다른 사용자가 예약한 좌석 취소 시 본인이 예약한 좌석이 아니라는 Alert창이 뜨는 것을 확인 할 수 있다.|자신이 예약한 좌석만 취소할 수 있다.<br/> 서버 메시지에 예약 취소 정보가 나타난다.|

기능|다른 사용자 좌석 취소|좌석 취소|
|------|---|---|
|화면|<p align="center"><img width="250" height="500" src="https://user-images.githubusercontent.com/59152019/205920752-8e2883be-854f-4ee2-9a9f-468f07015c4b.gif" /></p>|<p align="center"><img width="250" height="500" src="https://user-images.githubusercontent.com/59152019/205920758-bb2ec382-911f-419a-9f33-14db877d36b0.gif" /></p>|
|설명|다른 사용자가 예약한 좌석 취소 시 본인이 예약한 좌석이 아니라는 Alert창이 뜨는 것을 확인 할 수 있다.|자신이 예약한 좌석만 취소할 수 있다.<br/> 서버 메시지에 예약 취소 정보가 나타난다.|
<br/>
<br/>

## :page_facing_up: 테스트 환경
- iOS simulator iPhone14 iOS 16.0
