import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {Clipboard} from '@capacitor/clipboard';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

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
  public currentModif = {id: '', infosOrLiens: ''}; // stocke les informations du click sur un bouton de la card informations
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon

  constructor(
    private httpService: HttpService,
    private router: Router,
    private display: Display,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform
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
    this.currentModif = {id: '', infosOrLiens: ''};
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
      if (result.role !== 'cancel') {
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
      this.display.display('L\'image doit être au format jpg').then();
    } else {
      this.httpService.uploadImg(blobData, 'residence' + this.id, image.format).toPromise()
        .then(result => {
          this.display.display({code: 'L\'image a bien été ajouté', color: 'success'}).then();
          this.labelImage.el.textContent = 'L\'image a bien été mise en ligne';
        })
        .catch(err => {
          this.display.display('Une erreur a eu lieu' + err).then();
          this.labelImage.el.textContent = 'Une erreur a eu lieu, merci de réessayer';
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

    return new Blob(byteArrays, { type: contentType });
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

  async addInformations(infosOrLiens) {
    let alert = await this.alertController.create({
      header: 'Nom du nouveau thème',
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
        this.clickEvent(result.data.values.name, infosOrLiens);
      }
    });
  }

  async removeInformation(infosOrLiens) {
    const tmp = [];

    // on parcours la liste de plannings et on rajoute un bouton pour chaque
    for (const info of this.infos[infosOrLiens]) {
      tmp.push({
        text: info.id,
        role: info.id
      });
    }

    // on rajoute le bouton annuler
    tmp.push({
      text: 'Annuler',
      role: 'cancel'
    });

    // création de l'action sheet
    const actionSheet = await this.actionSheetController.create({
      header: 'Quel thème voulez-vous supprimer ?',
      cssClass: 'actionSheet',
      buttons: tmp
    });
    // on affiche l'action sheet
    await actionSheet.present();

    // lorsqu'une sélection est faite, on récupère son attribut
    await actionSheet.onDidDismiss().then(result => {
      if (result.role !== 'cancel') {
        // on récupère l'id a suupprimé
        let id = this.infos[infosOrLiens].findIndex(res => res.id === result.role);

        // suppression de la partie a supprimé
        this.infos[infosOrLiens] = this.infos[infosOrLiens].slice(0, id).concat(this.infos[infosOrLiens].slice(id + 1, this.infos[infosOrLiens].length));

        // suppression de la partie affiché
        this.currentModif = {id: '', infosOrLiens: ''};
      }
    });
  }

  // ajoute une ligne pour l'information affiché
  addLineInformation() {
    this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content.push('');
  }

  // supprimer une ligne de l'information affiché
  removeLineInformation() {
    this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content.pop();
  }

  // fonction lancé au click sur un des boutons de la partie information
  clickEvent(idInfo, infosOrLiens) {
    // stocke l'id clické, son contenu, ainsi que si c'est une info ou un lien
    if (this.currentModif.id === this.infos[infosOrLiens].findIndex(res => res.id === idInfo)) {
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
