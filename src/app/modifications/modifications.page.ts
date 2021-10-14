import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {HttpService} from "../core/http.service";

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.page.html',
  styleUrls: ['./modifications.page.scss'],
})
export class ModificationsPage implements OnInit {
  private id = '';
  public infos = new InfoResidenceModel();  // stockage du json
  public modifications = [];

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let after = false;
    // récupère l'email dans le lien
    for (const i of this.router.url) {
      if (after && i !== '=') {
        this.id += i;
      } else if (i === '?') {
        after = true;
      }
    }

    this.httpService.getJson(this.id).toPromise().then(result => {
      this.infos = result;
    })
  }

  clickEvent(info) {
    if (this.modifications[0] === info.content[0]) {
      this.modifications = [];
    }
    else {
      this.modifications = [];
      for (const content of info.content) {
        this.modifications.push(content);
      }
    }
  }

  ajoutLigneModif() {
    this.modifications.push('');
  }

  ajoutTheme(infoOrLien) {
  // ajouter alert pour demander le nom
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.ionViewWillEnter();
    }, 1000);
  }
}
