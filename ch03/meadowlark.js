const express = require('express');
const expressHandlebars = require('express-handlebars');

const fortune = require('./lib/fortune.js');

const app = express();
app.engine(
    'handlebars',
    expressHandlebars({
        defaultLayout: 'main'
    })
);

app.set('view engine', 'handlebars');

const port = process.env.port || 3000;
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => {
    res.render('about', { fortune: fortune.getFortune() });
});

app.use((req, res) => {
    res.status(400);
    res.render('404');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render('500');
});

app.listen(port, () => console.log(`Express started on https://localhost:${port}; ` + `press Ctrl-C to terminate.`));
