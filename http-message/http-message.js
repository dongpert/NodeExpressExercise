const express = require('express');
const expressHandlerbars = require('express-handlebars');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const catNames = require('cat-names');
const bodyParser = require('body-parser');
const app = express();

app.engine('handlebars', expressHandlerbars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ resave: false, saveUninitialized: false, secret: 'keyboard cat' }));

app.disable('x-powered-by');

app.get('/headers', (req, res) => {
    // const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`);
    const headers = Object.entries(req.headers);
    res.render('headers', { headers: req.headers });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/greeting', (req, res) => {
    res.render('greeting', {
        message: 'Hello esteemed programmer!',
        style: req.query.style,
        userid: req.cookies.userid,
        username: req.session.username
    });
});

app.get('/set-random-userid', (req, res) => {
    res.cookie('userid', (Math.random() * 10000).toFixed(0));
    res.redirect('/greeting');
});

app.get('/set-random-username', (req, res) => {
    req.session.username = catNames.random();
    res.redirect('/greeting');
});

app.get('/no-layout', (req, res) => {
    res.render('no-layout', { layout: null });
});

app.get('/custom-layout', (req, res) => {
    res.render('custom-layout', { layout: 'custom' });
});

app.get('/text', (req, res) => {
    res.type('text/plain');
    res.send('this is a test');
});

app.get('/page1', (req, res) => {
    res.render('page', { page: 1 });
});

app.get('/page2', (req, res) => {
    res.render('page', { page: 2 });
});

app.get('/page3', (req, res) => {
    res.render('page', { page: 3 });
});

app.get('/thank-you', (req, res) => {
    res.render('thank-you');
});

app.get('/contact-error', (req, res) => {
    res.render('contact-error');
});

app.get('/bad-bad-not-good', (req, res) => {
    throw new Error('that didn`t go well!');
});

app.get('/', (req, res) => res.render('home'));

app.post('/process-contact', (req, res) => {
    try {
        if (req.body.simulateError) throw new Error('error saving contact!');
        console.log(`contact from ${req.body.name} <${req.body.email}>`);
        res.format({
            'text/html': () => res.redirect(303, '/thank-you'),
            'application/json': () => res.json({ success: true })
        });
    } catch (err) {
        console.error(`error processing contact from ${req.body.name} <${req.body.email}>`);
        res.format({
            'text/html': () => res.redirect(303, `/contact-error`),
            'application/json': () =>
                res.status(500).json({
                    error: 'error saving contact information'
                })
        });
    }
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.use((err, req, res, next) => {
    console.error('** SERVER ERROR: ' + err.message);
    res.status(500).render('error', { message: "you shouldn't have clicked that!" });
});

const port = process.env.port || 5000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`));
