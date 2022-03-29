const express = require('express');
const expressHandlebars = require('express-handlebars');

//const fortune = require('./lib/fortune.js');
const handlers = require('./lib/handlers');

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

app.get('/', handlers.home);
app.get('/about', handlers.about);
app.use(handlers.notFound);
app.use(handlers.serverError);

// app.get('/', (req, res) => res.render('home'));

// app.get('/about', (req, res) => {
//     res.render('about', { fortune: fortune.getFortune() });
// });

// app.use((req, res) => {
//     res.render('404');
// });

// app.use((err, req, res, next) => {
//     console.error(err);
//     res.render('500');
// });

if (require.main === module) {
    app.listen(port, () => console.log(`Express started on https://localhost:${port}; ` + `press Ctrl-C to terminate.`));
} else {
    module.exports = app;
}
