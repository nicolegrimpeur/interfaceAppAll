import {Component} from '@angular/core';
import {Langue} from '../shared/langue';
import {AlertController, Platform} from '@ionic/angular';
import {HttpService} from '../core/http.service';
import {ListeModel} from '../shared/models/liste-model';
import {Router} from '@angular/router';
import {Display} from '../shared/class/display';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [HttpService]
})
export class HomePage {
  public langue: string; // stocke la lanque courante
  public liste = new ListeModel(); // stocke la liste des résidences

  constructor(
    private alertController: AlertController,
    private httpService: HttpService,
    private route: Router,
    private display: Display
  ) {
    // initialisation de la langue courante
    this.langue = Langue.value;
  }

  ionViewWillEnter() {
    // récupère la liste
    this.httpService.getListe().toPromise()
      .then(result => {
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
        message: 'Vous pouvez maintenant modifier les pages en Français',
        buttons: ['OK']
      });
    } else if (Langue.value === 'en') {
      alert = await this.alertController.create({
        subHeader: 'Langue switch to English',
        message: 'Vous pouvez maintenant modifier les pages en Anglais',
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

  // ajoute une nouvelle résidence
  async addResidence() {
    let alert = await this.alertController.create({
      cssClass: 'ajoutRes',
      header: 'Informations sur la nouvelle résidence',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom de la résidence (exemple Saint-Omer)'
        },
        {
          name: 'id',
          type: 'text',
          placeholder: 'Identifiant de la résidence (exemple STO)'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Ok',
        role: 'ok'
      }]
    });

    // on affiche l'alerte
    await alert.present();

    // on attend que l'utilisateur supprime l'alerte
    await alert.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.httpService.addRes(result.data.values.name, result.data.values.id).toPromise().then().catch((err) => {
          if (err.status === 200) {
            this.display.display({code: 'La résidence a bien été créé', color: 'success'}).then();
          } else if (err.status === 201) {
            this.display.display('La résidence existe déjà').then();
          } else {
            this.route.navigate(['/erreur']).then();
          }
          this.ionViewWillEnter();
        });
      }
    });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.ionViewWillEnter();
    }, 1000);
  }
}
