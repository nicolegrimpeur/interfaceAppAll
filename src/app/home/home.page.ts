import {Component} from '@angular/core';
import {Langue} from '../shared/langue';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {HttpService} from '../core/http.service';
import {ListeModel} from '../shared/models/liste-model';
import {Router} from '@angular/router';
import {Display} from '../shared/class/display';
import {Login} from '../shared/login';
import {StorageService} from '../core/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [HttpService]
})
export class HomePage {
  public liste = new ListeModel(); // stocke la liste des résidences
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private httpService: HttpService,
    private storageService: StorageService,
    private route: Router,
    private display: Display,
    private platform: Platform
  ) {
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
        if (result.data.values.name !== '' && result.data.values.id !== '') {
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
        } else {
          this.display.display('Une information n\'a pas été rentré').then();
        }
      }
    });
  }

  // permet de supprimer une résidence
  async removeResidence() {
    const tmp = [];

    // on parcours la liste de plannings et on rajoute un bouton pour chaque
    for (const res of this.liste.residence) {
      tmp.push({
        text: res.name,
        role: [res.name, res.id]
      });
    }

    // on rajoute le bouton annuler
    tmp.push({
      text: 'Annuler',
      role: 'cancel'
    });

    // création de l'action sheet
    const actionSheet = await this.actionSheetController.create({
      header: 'Quel résidence voulez-vous supprimer ?',
      cssClass: 'actionSheet',
      buttons: tmp
    });
    // on affiche l'action sheet
    await actionSheet.present();

    // lorsqu'une sélection est faite, on récupère son attribut
    await actionSheet.onDidDismiss().then(result => {
      if (result.role !== 'cancel' && result.role !== 'backdrop') {
        this.removeResidenceConfirm(result.role).then();
      }
    });
  }

  async removeResidenceConfirm(infosSuppr) {
    let alert = await this.alertController.create({
      cssClass: 'ajoutRes',
      header: 'Etes-vous sur de vouloir supprimer la résidence ' + infosSuppr[0] + ' ?',
      subHeader: 'La suppression supprimera toutes les données liés à cette résidence et est non réversible',
      buttons: [{
        text: 'Non',
        role: 'cancel'
      }, {
        text: 'Oui',
        role: 'oui'
      }]
    });

    // on affiche l'alerte
    await alert.present();

    // on attend que l'utilisateur supprime l'alerte
    await alert.onDidDismiss().then(result => {
      if (result.role !== 'cancel') {
        this.httpService.removeRes(infosSuppr[1]).toPromise().then().catch((err) => {
          if (err.status === 200) {
            this.display.display({code: 'La résidence a bien été supprimé', color: 'success'}).then();
          } else if (err.status === 201) {
            this.display.display('La résidence n\'existe pas encore').then();
          } else {
            this.route.navigate(['/erreur']).then();
          }
          this.ionViewWillEnter();
        });
      }
    });
  }

  verrouillage() {
    Login.isLog = false;
    this.storageService.setLogin().then();
    this.route.navigate(['/login']).then(() => {
      this.display.display({code: 'Verrouillage réussi', color: 'success'}).then();
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
