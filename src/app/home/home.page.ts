import {Component} from '@angular/core';
import {Langue} from '../shared/langue';
import {AlertController, Platform} from '@ionic/angular';
import {HttpService} from "../core/http.service";
import {ListeModel} from "../shared/models/liste-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [HttpService]
})
export class HomePage {
  public langue: string;
  public liste = new ListeModel();
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon

  constructor(
    private alertController: AlertController,
    private httpService: HttpService,
    private route: Router,
    private platform: Platform
  ) {
  }

  ionViewWillEnter() {
    if (this.mobile) {
      this.route.navigate(['/erreur']).then();
    }

    this.httpService.getListe().toPromise().then(result => {
      this.liste = result;
    })
      .catch(() => {
        this.route.navigate(['/erreur']).then();
      });
  }

  // redirige l'utilisateur au click sur un bouton
  clickEvent(id) {
    this.route.navigateByUrl('modifications?' + id).then();
  }

  // fonction lancé par le switch de langue
  changeLangue(event: any) {
    Langue.value = event.detail.value;
    this.addAlert().then();
  }

  // affiche l'alerte
  async addAlert() {
    let alert;
    if (Langue.value === 'fr') {
      alert = await this.alertController.create({
        subHeader: 'Changement de la langue en Français',
        message: 'Vous allez être redirigé sur la page d\'accueil',
        buttons: ['OK']
      });
    } else if (Langue.value === 'en') {
      alert = await this.alertController.create({
        subHeader: 'Langue switch to English',
        message: 'You will be redirect on the main page',
        buttons: ['OK']
      });
    }

    // on affiche l'alerte
    await alert.present();

    // on attend que l'utilisateur supprime l'alerte
    await alert.onDidDismiss();

    // on change la langue de la page
    this.langue = Langue.value;
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.ionViewWillEnter();
    }, 1000);
  }
}
