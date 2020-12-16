var express = require('express');
var app = express();
var path = require('path');
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku
var bodyParser = require("body-parser");

var userBase = [
    { id: 100, login: 'sapico', password: 'a', age: 10, student: undefined, gender: 'male' },
    { id: 101, login: 'marcin', password: 'knapczyk', age: 18, student: 'on', gender: 'male' },
    { id: 102, login: 'jakubin', password: 'zaq1@WSX', age: 28, student: undefined, gender: 'male' },
    { id: 99, login: 'ala', password: 'ala', age: 12, student: 'on', gender: 'female' },
    { id: 72, login: 'tomek', password: 'tomek', age: 22, student: 'on', gender: 'male' },
    { id: 103, login: 'ewa', password: 'ewa', age: 31, student: undefined, gender: 'female' }
];

var id = 1;
let userExists = false;
let userLoggedIn = false;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/main.html'));
});
app.get('/main', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/main.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/register.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/login.html'));
});
app.get('/admin', function (req, res) {
    if (userLoggedIn) {
        res.sendFile(path.join(__dirname + '/static/adminRegistered.html'));
    }
    else {
        res.sendFile(path.join(__dirname + '/static/admin.html'));
    }
});
app.get('/adminRegistered.html', function (req, res) {
    if (userLoggedIn) {
        res.sendFile(path.join(__dirname + '/static/adminRegistered.html'));
    }
    else {
        res.sendFile(path.join(__dirname + '/static/admin.html'));
    }
});
app.get('/logout', function (req, res) {
    userLoggedIn = false;
    res.send(`Pomyślnie wylogowano z konta. <a href="login">Zaloguj się ponownie</a>`)
});
app.get('/sort', function (req, res) {
    if (userLoggedIn) {
        let sortedUserBase = [];
        userBase.forEach(user => { sortedUserBase.push(user); })
        let pageString = `<head><title>Admin panel</title><link rel='stylesheet' href='css/style.css'></head>
        <body style='background:rgb(39, 42, 43);'><ul class='sort'><li><a href='sort'>sort</a><li/><li><a href='gender'>gender</a><li/><li><a href='show'>show</a><li/></ul><br>
        <form class="sort" action="/handleSortForm" method="GET" onchange="this.submit()"><input type="radio" name="sort" value="increasing"><label for="sort">rosnąco</label>
        <input type="radio" name="sort" value="decreasing"><label for="sort">malejąco</label></form>
        <table>`;
        sortedUserBase.forEach(user => {
            pageString += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td>
            <td>uczeń: ${(user.student == 'on') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.age}</td><td>płeć: ${(user.gender == 'female') ? 'k' : 'm'}</td></tr>`;
        });
        pageString += "</table></body>";
        res.send(pageString);
    }
});
app.get("/handleSortForm", function (req, res) {
    let sort = req.query.sort;
    let sortedUserBase = [];
    userBase.forEach(user => { sortedUserBase.push(user); })
    if (sort == 'increasing') {
        sortedUserBase.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
    } else {
        sortedUserBase.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        });
    }
    let pageString = `<head><title>Admin panel</title><link rel='stylesheet' href='css/style.css'></head>
        <body style='background:rgb(39, 42, 43);'><ul class='sort'><li><a href='sort'>sort</a><li/><li>
        <a href='gender'>gender</a><li/><li><a href='show'>show</a><li/></ul><br>
        <form class="sort" action="/handleSortForm" method="GET" onchange="this.submit()">
        <input type="radio" name="sort" ${(sort == 'increasing') ? 'checked = "checked"' : false} value="increasing"><label for="sort">rosnąco</label>
        <input type="radio" name="sort" ${(sort == 'decreasing') ? 'checked = "checked"' : false} value="decreasing"><label for="sort">malejąco</label>
        </form><table>`;
    sortedUserBase.forEach(user => {
        pageString += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td>
            <td>uczeń: ${(user.student == 'on') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.age}</td><td>płeć: ${(user.gender == 'female') ? 'k' : 'm'}</td></tr>`;
    });
    pageString += "</table></body>";
    res.send(pageString);
});
app.get('/gender', function (req, res) {
    if (userLoggedIn) {
        if (userLoggedIn) {
            let pageString = `<head><title>Admin panel</title><link rel='stylesheet' href='css/style.css'></head>
            <body style='background:rgb(39, 42, 43);'><ul class='sort'><li><a href='sort'>sort</a><li/><li><a href='gender'>gender</a><li/><li><a href='show'>show</a><li/></ul><br><table>`;
            let femaleTableString = `<table class="gender">`;
            let maleTableString = `<table class="gender">`;
            userBase.forEach(user => {
                if (user.gender == 'female') {
                    femaleTableString += `<tr><td>id: ${user.id}</td><td>płeć: ${(user.gender == 'female') ? 'k' : 'm'}</td></tr>`;
                } else {
                    maleTableString += `<tr><td>id: ${user.id}</td><td>płeć: ${(user.gender == 'female') ? 'k' : 'm'}</td></tr>`;
                }
            });
            femaleTableString += "</table>"; maleTableString += "</table>";
            pageString += femaleTableString + maleTableString + "</body>";
            res.send(pageString);
        }
    }
});
app.get('/show', function (req, res) {
    if (userLoggedIn) {
        let pageString = `<head><title>Admin panel</title><link rel='stylesheet' href='css/style.css'></head>
        <body style='background:rgb(39, 42, 43);'><ul class='sort'><li><a href='sort'>sort</a><li/><li><a href='gender'>gender</a><li/><li><a href='show'>show</a><li/></ul><br><table>`;
        userBase.forEach(user => {
            pageString += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td>
            <td>uczeń: ${(user.student == 'on') ? '<input type="checkbox" checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.age}</td><td>płeć: ${(user.gender == 'female') ? 'k' : 'm'}</td></tr>`;
        });
        pageString += "</table></body>";
        res.send(pageString);
    }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/handleRegisterForm", function (req, res) {
    let alreadyExists = false;
    userBase.forEach(user => {
        if (req.body.login == user.login) {
            alreadyExists = true;
        }
    });
    if (!alreadyExists) {
        let newUser = { id: id, login: req.body.login, password: req.body.password, age: req.body.age, student: req.body.student, gender: req.body.gender };
        userBase.push(newUser);
        id++;
        console.log(userBase);
        res.send(`Witaj, ${req.body.login}. Udało ci się zarejestrować. <a href="login">Przejdź do strony logowania</a>`);
    } else {
        res.send(`Błąd rejestracji. Użytkownik ${req.body.login} już istnieje. <a href="register">Spróbuj ponownie z innym loginem</a>`);
    }
});
app.get("/handleLoginForm", function (req, res) {
    userExists = false;
    userLoggedIn = false;
    userBase.forEach(user => {
        if (req.query.login == user.login) {
            userExists = true;
            if (req.query.password == user.password) {
                userLoggedIn = true;
            }
        }
    });
    (userLoggedIn) ? console.log("Użytkownik zalogowany") : console.log("Użytkownik nie zalogowany");
    (userLoggedIn) ? res.redirect('/admin') : res.send(`Niepoprawne dane logowania. <a href="login">Spróbuj ponownie</a>`);
});

app.use(express.static('static'));

app.listen(PORT, function () {
    console.log('start serwera na porcie ' + PORT);
});