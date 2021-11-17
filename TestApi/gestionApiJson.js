const fs = require("fs");
const del = require("del");

module.exports = class GestionApiJson {
    // path = '/home/rps/infosApp/';
    path = './json/';

    constructor() {
    }

    // permet d'initialiser les fichiers d'une nouvelle résidence
    initResidence(name, id, res) {
        const template = {
            langue: '',
            name: name,
            news: '',
            nameLiens: '',
            liens: [],
            nameInfos: '',
            infos: [],
            bullesLien: [],
            colInfo: []
        }

        // on récupère la liste de résidence
        const liste = JSON.parse(fs.readFileSync(this.path + 'listeResidences.json'));

        // on vérifie que la résidence n'existe pas déjà
        if (liste.residence.find(res => res.id === id.toUpperCase()) === undefined && id !== 'undefined') {
            // on créé les fichiers fr et en
            template.langue = 'fr';
            template.nameLiens = 'Annonces';
            template.nameInfos = 'Informations';
            fs.writeFileSync(this.path + id.toUpperCase() + '_fr.json', JSON.stringify(template, null, 2));

            template.langue = 'en';
            template.nameLiens = 'Announcements';
            template.nameInfos = 'Informations';
            fs.writeFileSync(this.path + id.toUpperCase() + '_en.json', JSON.stringify(template, null, 2));

            // on met à jour la liste de résidence avec la nouvelle
            liste.residence.push(
                {id: id.toUpperCase(), name: name}
            );
            fs.writeFileSync(this.path + 'listeResidences.json', JSON.stringify(liste, null, 2));

            if (res !== undefined) res.status(200).send('ok');
        } else {
            if (res !== undefined) res.status(201).send('pas content');
        }
    }

    // permet de supprimer une résidence
    removeResidence(id, res) {
        // on récupère la liste de résidence
        const liste = JSON.parse(fs.readFileSync(this.path + 'listeResidences.json'));

        const ind = liste.residence.findIndex(res => res.id === id.toUpperCase());
        if (ind !== undefined) {
            liste.residence = liste.residence.slice(0, ind).concat(liste.residence.slice(ind + 1, liste.residence.length));

            fs.writeFileSync(this.path + 'listeResidences.json', JSON.stringify(liste, null, 2));

            del([this.path + id + '_fr' + '.json'], {force: true}).then();
            del([this.path + id + '_en' + '.json'], {force: true}).then();

            if (res !== undefined) res.status(200).send('Suppression effectué');
        } else {
            if (res !== undefined) res.status(201).send('La résidence n\'existe pas encore');
        }
    }
}
