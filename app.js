const express = require('express');
const fs = require('fs');
const compression = require('compression');
const path = require('path');
const hbs = require('hbs');
const indexRouter = require('./routes/index');
const pageRouter = require('./routes/page');

const app = express();

const port = process.env.PORT || 3000;

const publicDirecPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

// 정적 파일(이미지, js, css파일 등) 사용
// 익스프레스 기본 제공 미들웨어 함수 express.static
// 정적 파일 포함된 디렉토리 명 직접 지정. public
app.use(express.static(publicDirecPath));

hbs.registerPartials(partialsPath); // partial 사용하기 위해

// body parser 미들웨어. req.body 읽어옴
app.use(express.urlencoded({ extended: false }));

// compression 미들웨어. 압축
app.use(compression());


// 미들웨어 직접 만들어보자.
// 미들웨어는 함수 형식
app.get('*', (req, res, next) => { // use 대신 get으로 바꿈. *은 모든 요청이라는 뜻. 즉 
  // get으로 들어오는 모든 요청만 파일 목록 가져옴. post는 x
  // app.use('/user:id' ~) 처럼 특정 경로에만 미들웨어 동작하게 할 수 있음.
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next(); // 그 다음 미들웨어 호출
  })
})

app.use('/', indexRouter); // 홈

// page으로 시작하는 주소들에게 pageRouter라는 미들웨어를 적용하겠다는 뜻.
app.use('/page', pageRouter);

// 모든 요청에서 실행
app.use((req, res, next) => {
  res.status(404).send("404 : can't find that!");
});

app.use((err, req, res, next) => { // 에러 처리 미들웨어. 인자 4개
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`${port}번 포트에서 실행!`);
});