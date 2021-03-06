import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {HttpService} from "../core/http.service";
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.page.html',
  styleUrls: ['./erreur.page.scss'],
})
export class ErreurPage implements OnInit {
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon
  private interval; // stocke le refresh automatique

  constructor(
    private platform: Platform,
    private router: Router,
    private httpService: HttpService
  ) {
    // on vérifie si l'on peut de nouveau accéder au serveur toutes les 5 secondes
    this.interval = setInterval(() => {
      this.checkList();
    }, 5000);
  }

  ngOnInit() {
  }

  // check si la connexion au serveur est de retour
  checkList() {
    lastValueFrom(this.httpService.getJson('All'))
      .then(() => {
        this.router.navigate(['/']).then();

        // on supprime la vérification
        clearInterval(this.interval);
      })
      .catch(() => {});
  }

  // événement pour rafraichir la page avec un slide
  doRefresh(event) {
    setTimeout(() => {
      // rafraichi le json
      this.checkList();
      // permet de terminer l'animation
      event.target.complete();
    }, 1000);
  }
}
