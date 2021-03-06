import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {Clipboard} from '@capacitor/clipboard';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {Langue} from '../shared/langue';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.page.html',
  styleUrls: ['./modifications.page.scss']
})
export class ModificationsPage implements OnInit {
  @ViewChild('ionSelect') ionSelect;
  @ViewChild('labelImage') labelImage;

  private id = ''; // stocke l'id de la résidence
  public infos = new InfoResidenceModel();  // stockage du json
  public currentModif = {id: '', infosOrLiens: '', idButton: ''}; // stocke les informations du click sur un bouton de la card informations
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon
  public langue: string; // stocke la lanque courante
  public imageExist: boolean; // true si une image a déjà été initialisé pour cette résidence

  constructor(
    private httpService: HttpService,
    private router: Router,
    private display: Display,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform
  ) {
    // initialisation de la langue courante
    this.langue = Langue.value;
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
    this.downloadImg();
  }

  // récupère le json de la résidence et le stocke
  getJson() {
    if (this.id !== '') {
      lastValueFrom(this.httpService.getJsonAVerifier(this.id))
        .then(result => {
          this.infos = result;
        })
        .catch(err => {
          this.router.navigate(['/erreur']).then();
        });
    }
    this.currentModif = {id: '', infosOrLiens: '', idButton: ''};
  }

  annuler() {
    if (this.id !== '') {
      this.display.alertPersonnalise(
        Langue.value === 'fr' ?
          'Voulez-vous annuler toutes les modifications depuis le dernier ajout sur le site nicob.ovh/all, ou juste les dernières modifications ?' :
          'Do you want to undo all the changes since the last addition to the nicob.ovh/all site, or just the latest changes?',
        '',
        [
          {
            text: Langue.value === 'fr' ? 'Toutes' : 'All changes',
            role: 'all'
          },
          {
            text: Langue.value === 'fr' ? 'Dernières' : 'Latest',
            role: 'last'
          },
          {
            text: Langue.value === 'fr' ? 'Annuler' : 'Cancel',
            role: 'cancel'
          }
        ])
        .then(result => {
          if (result !== 'cancel' && result !== 'backdrop') {
            if (result === 'all') {
              lastValueFrom(this.httpService.getJson(this.id))
                .then(result => {
                  this.infos = result;
                })
                .catch(err => {
                  console.log(err)
                  lastValueFrom(this.httpService.getJsonAVerifier(this.id))
                    .then(result => {
                      this.infos = result;
                    })
                    .catch(() => {
                      this.router.navigate(['/erreur']).then();
                    });
                });
            } else if (result === 'latest') {
              lastValueFrom(this.httpService.getJsonAVerifier(this.id))
                .then(result => {
                  this.infos = result;
                })
                .catch(err => {
                  this.router.navigate(['/erreur']).then();
                });
            }
          }
        });
    }
    this.currentModif = {id: '', infosOrLiens: '', idButton: ''};
  }

  // fonction lancé par le switch de langue
  async changeLangue(event: any) {
    await this.enregistrer();
    Langue.value = event.detail.value;
    this.addAlert().then();
    this.ionViewWillEnter();
  }

  // affiche l'alerte
  async addAlert() {
    await this.display.alertPersonnalise(
      Langue.value === 'fr' ? 'Changement de la langue en Français' : 'Langue switch to English',
      Langue.value === 'fr' ? 'Vous pouvez maintenant modifier la page en Français' : 'You can now edit the page in English',
      ['OK']
    );

    // on change la langue de la page
    this.langue = Langue.value;
  }

  // permet d'ajouter au presse papier l'élément voulu
  async createLink() {
    // créer l'alerte Avec les inputs
    let alert = await this.alertController.create({
      header: 'Informations pour le lien à copier',
      inputs: [
        {
          name: 'link',
          type: 'text',
          placeholder: 'Lien'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Copier',
        role: 'ok'
      }]
    });

    // on affiche l'alerte
    await alert.present();

    // on attend que l'utilisateur supprime l'alerte
    await alert.onDidDismiss().then((result) => {
      if (result.role !== 'cancel' && result.role !== 'backdrop') {
        // on ajoute au presse papier la balise de lien
        Clipboard.write({
          string: "<a href='" + result.data.values.link + "' title='" + result.data.values.description + "' target='_blank'>" + result.data.values.description + "</a>"
        });

        this.display.display({code: 'Lien copié au presse papier', color: 'success'}).then();
      }
    });
  }

  async accessGallery() {
    let image;
    let blobData;

    const options = {
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      sourceType: CameraSource.Photos
    }

    await Camera.getPhoto(options)
      .then(result => {
        image = result;
        blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
      })
      .catch((err) => {
        this.display.display('Une erreur a eu lieu : ' + err).then();
      });

    if (image.format !== 'jpeg') {
      this.display.display(this.langue === 'fr' ? 'L\'image doit être au format jpg' : 'The image must be in jpg format').then();
    } else {
      lastValueFrom(this.httpService.uploadImg(blobData, 'residence' + this.id, image.format))
        .then(result => {
          this.display.display({
            code: this.langue === 'fr' ? 'L\'image a bien été ajouté' : 'The image has been added',
            color: 'success'
          }).then();
          this.labelImage.el.textContent =
            this.langue === 'fr' ? 'L\'image a bien été mise en ligne' : 'The image has been uploaded';

          this.imageExist = true;
        })
        .catch(err => {
          this.display.display((this.langue === 'fr' ? 'Une erreur a eu lieu' : 'An error has occurred') + err).then();
          this.labelImage.el.textContent =
            this.langue === 'fr' ? 'Une erreur a eu lieu, merci de réessayer' : 'An error has occurred, please try again';
        });
    }
  }

  // permet de convertir l'image en blob
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  // permet de télécharger l'image de la résidence
  downloadImg() {
    lastValueFrom(this.httpService.downloadImg(this.id))
      .then(res => {
        // ouvre une nouvelle page en affichant l'image
        if (this.imageExist !== undefined) window.open(window.URL.createObjectURL(res));

        this.imageExist = true;
      })
      .catch(err => {
        if (err.status === 500) {
          if (this.imageExist !== undefined) this.display.alert('L\'image n\'a pas été trouvé').then();
          this.imageExist = false;
        } else this.display.alert('Une erreur a eu lieu, merci de réessayer plus tard').then();
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
  async removeLine(idInfos) {
    const result = await this.display.actionSheet(
      this.infos[idInfos],
      (this.infos[idInfos][0].title === undefined) ? '' : 'title',
      (Langue.value === 'fr') ? 'Quel ligne voulez-vous supprimer ?' : 'Which line do you want to remove?');

    if (result !== 'cancel' && result !== 'backdrop') {
      // suppression de la partie à supprimer
      this.infos[idInfos] = this.infos[idInfos].slice(0, result).concat(this.infos[idInfos].slice(result + 1, this.infos[idInfos].length));
    }
  }

  async addInformations(infosOrLiens) {
    let alert = await this.alertController.create({
      header: this.langue === 'fr' ? 'Nom du nouveau thème' : 'Name of the new theme',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom'
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
        this.infos[infosOrLiens].push({
          id: result.data.values.name,
          content: ['']
        });
        this.clickEvent(result.data.values.name, infosOrLiens, '');
      }
    });
  }

  async removeInformation(infosOrLiens) {
    const result = await this.display.actionSheet(
      this.infos[infosOrLiens],
      'id',
      (Langue.value === 'fr') ? 'Quel thème voulez-vous supprimer ?' : 'Which topic do you want to remove?');

    if (result !== 'cancel' && result !== 'backdrop') {
      // suppression de la partie a supprimé
      this.infos[infosOrLiens] = this.infos[infosOrLiens].slice(0, result).concat(this.infos[infosOrLiens].slice(result + 1, this.infos[infosOrLiens].length));

      // suppression de la partie affiché
      this.currentModif = {id: '', infosOrLiens: '', idButton: ''};
    }
  }

  // ajoute une ligne pour l'information affiché
  addLineInformation() {
    this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content.push('');
  }

  // supprimer une ligne de l'information affiché
  async removeLineInformation() {
    const tmpInfo = this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content;

    const result = await this.display.actionSheet(
      tmpInfo,
      '',
      (Langue.value === 'fr') ? 'Quel ligne voulez-vous supprimer ?' : 'Which line do you want to remove?');

    if (result !== 'cancel' && result !== 'backdrop') {
      this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content =
        tmpInfo.slice(0, result).concat(tmpInfo.slice(result + 1, tmpInfo.length))
    }
  }

  // fonction lancé au click sur un des boutons de la partie information
  async clickEvent(idInfo, infosOrLiens, id) {
    // si un bouton a déjà été sélectionné, on lui enlève sa sélection
    if (this.currentModif.idButton !== '') {
      document.getElementById(this.currentModif.idButton).setAttribute('fill', 'solid');
    }
    // si l'id est vide (nouveau bouton)
    if (id === '') {
      // l'html a pas le temps de se recharger avec le nouveau bouton avant d'essayer de récupérer le bouton
      // du coup un petit délai pour laisser le temps à l'html de se recharger
      await new Promise(f => setTimeout(f, 10));
      id = (infosOrLiens === 'liens' ? 0 : 10) + this.infos[infosOrLiens].length - 1;
    }

    // bouton à modifier
    const button = document.getElementById(id);
    // stocke l'id clické, son contenu, ainsi que si c'est une info ou un lien
    if (this.currentModif.id === this.infos[infosOrLiens].findIndex(res => res.id === idInfo) && this.currentModif.infosOrLiens === infosOrLiens) {
      this.currentModif = {id: '', infosOrLiens: '', idButton: ''};
      button.setAttribute('fill', 'solid');
    } else {
      this.currentModif.id = this.infos[infosOrLiens].findIndex(res => res.id === idInfo);
      this.currentModif.infosOrLiens = infosOrLiens;
      this.currentModif.idButton = id;
      button.setAttribute('fill', 'outline');
    }
  }

  // se lance au click sur enregistrer
  // enregistre toutes les modifications en ligne
  enregistrer() {
    lastValueFrom(this.httpService.uploadModifs(this.infos, this.id))
      .then()
      .catch(err => {
        if (err.status === 200) {
          this.display.display({
            code: this.langue === 'fr' ? 'Modification enregistré' : 'Registered change',
            color: 'success'
          }).then();
        } else {
          this.display.display((this.langue === 'fr' ? 'Une erreur a eu lieu : ' : 'An error has occurred : ') + err.name).then();
        }
      });
  }

  // fonction utilisant la propriété trackBy de ngFor dans le cas de l'affichage des infos
  inputNgFor(index, item) {
    return index;
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
