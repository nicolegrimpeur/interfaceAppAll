const portHTTPS = 1080;

const express = require('express');
const fs = require('fs');
const appHTTPS = express();
const serverHTTPS = require('http').createServer(appHTTPS);

appHTTPS.use(express.static(__dirname));
// pour l'api principalement
appHTTPS.use(function (req, res, next) {
    // site que je veux autoriser à se connecter
    res.setHeader('Access-Control-Allow-Origin', '*');

    // méthodes de connexion autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    next();
});

const Gestion = require('./gestion');

appHTTPS.post('/upload', Gestion.upload);

serverHTTPS.listen(portHTTPS);

console.log("let's go http port : " + portHTTPS);
