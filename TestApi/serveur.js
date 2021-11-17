// port utilisé par le site
const portHTTPS = 1080;

// instanciation du serveur
const express = require('express');
const bodyParser = require('body-parser');
let fs = require('fs');
const appHTTPS = express();
const serverHTTPS = require('http').createServer(appHTTPS);

appHTTPS.enable('trust proxy');

appHTTPS.use(express.static(__dirname));
appHTTPS.use(bodyParser.json());

// pour l'api principalement
appHTTPS.use(function (req, res, next) {
    // site que je veux autoriser à se connecter
    res.setHeader('Access-Control-Allow-Origin', '*');

    // méthodes de connexion autorisées
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST']);

    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    next();
});

const GestionApiJson = require('./gestionApiJson');
const gestionApiJson = new GestionApiJson();

const GestionApiUpload = require('./gestionApiUpload');

const pathAppAll = './json/';
// const pathAppAll = '/home/rps/infosApp/';

appHTTPS.get('/apiJson/:id', function (req, res) {
  const id = String(req.params.id);
  const textes = JSON.parse(fs.readFileSync(pathAppAll + id + '.json'));
  res.status(200).json(textes);
});

// pour ajouter une résidence
appHTTPS.get('/apiJson/addRes/:name/:id', function (req, res) {
  const id = String(req.params.id);
  const name = String(req.params.name);

  gestionApiJson.initResidence(name, id, res);
});

// pour supprimer une résidence
appHTTPS.get('/apiJson/removeRes/:id', function (req, res) {
    const id = String(req.params.id);

    gestionApiJson.removeResidence(id, res);
});

// pour mettre à jour le fichier d'une résidence
appHTTPS.post('/apiJson/upload/:id/:name', function (req, res) {
    const id = String(req.params.id);
    const langue = String(req.params.name);
    const json = req.body;

    fs.writeFileSync(pathAppAll + id + '_' + langue + '.json', JSON.stringify(json, null, 2));

    res.status(200).send('ok');
});

// pour vérifier que le mot de passe est bon
appHTTPS.get('/mdpRP/:id', function (req, res) {
    const id = String(req.params.id);

    const mdp = 'Hell0Rps';

    if (id === mdp) {
        res.status(200).send('Mot de passe valide');
    } else {
        res.status(201).send('Mot de passe invalide');
    }
});

appHTTPS.get('/apiJson/get/:name', GestionApiUpload.download);

appHTTPS.post('/apiJson/upload', GestionApiUpload.upload);

// appHTTPS.post('/apiJson/upload/', function (req, res) {
//     console.log(req.file);
//     console.log(req.body);
//
//     // const json = req.body;
//     //
//     // console.log(json);
//     //
//     // fs.writeFileSync('./upload/test.png', json);
//
//     res.status(200).send('ok');
// });

serverHTTPS.listen(portHTTPS);

console.log("let's go https port : " + portHTTPS);
