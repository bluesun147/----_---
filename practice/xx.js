const path = require('path');
const express = require('express');
const hbs = require('hbs');


const app = express();

const port = process.env.PORT || 3000; // heroku가 제공하는 port. 없으면 3000 (locally)

const publicDirecPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './views');
//const partialsPath = path.join(__dirname, '../templates/partials');


// setup hbs engine and views location
app.set('view engine', 'hbs');
// define path for Express config
app.set('views', viewsPath);

//hbs.registerPartials(partialsPath); // partial 사용하기 위해

// setup static directory to serve
app.use(express.static(publicDirecPath));

app.get('', (req, res) => { // root. 처음 페이지
    res.render('index', {
        title: 'Weather',
        name: 'Chan',
    });
});

// app.get('/about', (req, res) => {
//     res.render('about', {
//         title: 'About',
//         name: 'Chan',
//     });
// })

app.listen(port, () => {
    console.log(`server is up on port ${port}.`);
})













// const express = require('express');
// const path = require('path');

// const app = express();

// const pub = path.join(__dirname, '../public');

// const port = process.env.PORT || 3000;

// const viewsPath = path.join(__dirname, './views');
// app.set('view engine', 'hbs');
// app.use(express.static(pub));
// app.set('views', viewsPath);

// app.get('', (req, res, next) => { // use 대신 get으로 바꿈. *은 모든 요청이라는 뜻. 즉 
//     res.render('index', {
//         title: 'tt'
//     })
//   })

//   app.listen(port, () => {
//     console.log(`${port}에서 실행!`);
//   });