const express = require('express');
const router = express.Router();
const fs = require('fs');
const methodOverride = require('method-override');

// put, delete html에서 사용하려면 method-override 패키지.
// <form action="~?method=DELETE" method="put">
router.use(methodOverride('_method'));

// page/
router.get('', (req, res) => {
    const title = 'page';
    const list = req.list;
    res.render('page', { // views/page.hbs
        title,
        list
    });
});

// /page/:pageId 밑에 있으면 page 제어에 걸리므로 위로 올려야 함.
router.get('/create', (req, res) => {

    const title = 'create';
    const list = req.list;
    res.render('create', { // views/create.hbs
        title,
        list
    });
});

router.post('/create_process', (req, res) => {
    let post = req.body; // 리퀘스트 객체의 body 프로퍼티에 접근. 간단
    const title = post.title; // 제목
    const description = post.description; // 설명
    console.log('req.body = ', post); // [Object: null prototype] { title: 'qq', description: 'zz' }

    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        res.redirect(`/page/${title}`); // 익스프레스에서 page/title 로 리다이렉트
    });
});

router.get('/update/:pageId', (req, res) => {

    console.log('req.params is ', req.params);
    
    fs.readFile(`data/${req.params.pageId}`, 'utf8', function (err, description) {
        const title = req.params.pageId;

        const list = req.list;

        res.render('update', { // views/update.hbs
            title,
            list,
            description
        });
    });
});

router.post('/update_process', (req, res) => {

    let post = req.body; // 리퀘스트 객체의 body 프로퍼티에 접근. 간단
    console.log('req.body is ', req.body);
    const id = post.id; // name = "id"인 요소, 기존 제목
    const title = post.title; // 새 제목
    const description = post.description; // 설명
    fs.rename(`data/${id}`, `data/${title}`, (error) => { // 파일명 변경. oldpath, newPath, callback
        // 내용 바꾸기
        fs.writeFile(`data/${title}`, description, 'utf8', () => {
            res.redirect(`/page/${title}`); // 리다이렉션. 쓴 글 페이지로 바로 이동.
        });
    });
});

router.delete('/delete_process', (req, res) => {
    const post = req.body;
    const id = post.id;
    fs.unlink(`data/${id}`, (error) => {
        res.redirect('/'); // /으로 리다이렉트
    });
});

// 제일 밑에 쓰는 이유 ex) /create가 밑에 있으면 create를 pageId로 인식하게 됨.
router.get('/:pageId', (req, res, next) => {
    // return res.send(req.params); // http://localhost:3000/page/html => { "pageId": "html" }

    fs.readFile(`data/${req.params.pageId}`, 'utf8', function (err, description) {

        if (err) {
            next(err); // 에러 있는 경우 next에 인자
        } else {
            const title = req.params.pageId;

            const list = req.list;

            res.render('singlePage', {  // views/singlePage.hbs
                title,
                list,
                description
            });
        };
    });
});

module.exports = router;