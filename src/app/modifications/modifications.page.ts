import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.page.html',
  styleUrls: ['./modifications.page.scss'],
})
export class ModificationsPage implements OnInit {
  @ViewChild('divElement') divElement;
  @ViewChild('ionSelect') ionSelect;

  private id = ''; // stocke l'id de la résidence
  public infos = new InfoResidenceModel();  // stockage du json
  public currentModif = {id: '', content: [], infosOrLiens: ''}; // stocke les informations du click sur un bouton de la card informations

  constructor(
    private httpService: HttpService,
    private router: Router,
    private display: Display
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let after = false;
    // récupère l'id dans le lien
    if (this.id === '') {
      for (const i of this.router.url) {
        if (after && i !== '=') {
          this.id += i;
        } else if (i === '?') {
          after = true;
        }
      }
    }

    this.getJson();
  }

  // récupère le json de la résidence et le stocke
  getJson() {
    this.httpService.getJson(this.id).toPromise()
      .then(result => {
        this.infos = result;
      })
      .catch(err => {
        this.router.navigate(['/erreur']).then();
      });
  }

  // ajoute une ligne pour les news
  addLineNews() {
    this.infos.news.push('');
  }

  // ajoute une ligne pour les colonnes d'informations
  addLineColInfo() {
    this.infos.colInfo.push({
      title: '',
      info1: '',
      info2: ''
    });
  }

  // ajoute une ligne pour les bulles
  addLineBulles() {
    this.infos.bullesLien.push({
      title: '',
      href: '',
      logo: ''
    });
  }

  // supprime le dernier élément de id
  removeLine(id) {
    this.infos[id].pop();
  }

  // stocke les modifications effectués sur la textarea en local
  ionChange(event, ...path) {
    switch (path.length) {
      case 1:
        this.infos[path[0]] = event.detail.value;
        break;
      case 2:
        this.infos[path[0]][path[1]] = event.detail.value;
        break;
      case 3:
        this.infos[path[0]][path[1]][path[2]] = event.detail.value;
        break;
      case 4:
        this.infos[path[0]][path[1]][path[2]][path[3]] = event.target.firstChild.firstChild.value;
        break;
    }
  }

  // fonction lancé au click sur un des boutons de la partie information
  clickEvent(idInfo, infosOrLiens) {
    // stocke l'id clické, son contenu, ainsi que si c'est une info ou un lien
    if (this.currentModif.id === idInfo) {
      this.currentModif.id = '';
      this.currentModif.infosOrLiens = '';
    } else {
      this.currentModif.id = this.infos[infosOrLiens].findIndex(res => res.id === idInfo);
      this.currentModif.infosOrLiens = infosOrLiens;
    }
  }

  // se lance au click sur enregistrer
  // enregistre toutes les modifications en ligne
  enregistrer() {
    this.httpService.uploadModifs(this.infos, this.id).toPromise()
      .then()
      .catch(err => {
        if (err.status === 200) {
          this.display.display({code: 'Modification effectué', color: 'success'}).then();
        } else {
          this.display.display('Une erreur a eu lieu : ' + err.name).then();
        }
      });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.getJson();
    }, 1000);
  }
}
