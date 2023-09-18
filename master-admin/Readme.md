# TimeOrderReactAdmin


### 필수 프로그램

1. npm
   - JS 라이브러리 저장소
2. yarn
   - npm 개선 익스텐션


### 사용 라이브러리

1. React.js
   - SPA 라이브러리
2. React Material UI
   - 디자인 라이브러리
3. moment.js
   - 날짜 라이브러리
4. numeral.js
   - 숫자 라이브러리


### Clone 후 초기 설정

> 1. yarn install
>    - 사용하는 패키지 모두 설치
> 2. yarn start
>    - 서버 구동


### 디렉토리 구조

- public : 리소스 폴더
  - img : 이미지
  - js : json
- src : 프로젝트 소스. 각 폴더마다 index.js 필수
  - components : 화면
    - common : 공통 화면
    - page : 페이지
  - style : CSS
  - App.js : 실행되는 App
  - index.js : 최초에 실행되어 App을 구동 시켜줌
  - Router.js : App에서 라우팅이 가능하도록 라우팅을 선언 해줌
  - state.js : 글로벌 변수