import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {HttpService} from "../core/http.service";

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.page.html',
  styleUrls: ['./modifications.page.scss'],
})
export class ModificationsPage implements OnInit {
  @ViewChild('divElement') divElement;
  @ViewChild('ionSelect') ionSelect;

  private id = '';
  public infos = new InfoResidenceModel();  // stockage du json
  public modifications = [];
  private currentModif = {id: '', infosOrLiens: ''};
  public currentValueSelect = '';

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
  //
  // clickEvent(info, infosOrLiens) {
  //   console.log(info);
  //   if (this.modifications[0] === info.content[0]) {
  //     this.modifications = [];
  //     this.currentModif.id = '';
  //     this.currentModif.infosOrLiens = '';
  //   } else {
  //     this.modifications = [];
  //     for (const content of info.content) {
  //       this.modifications.push(content);
  //     }
  //     this.currentModif.id = this.infos[infosOrLiens].findIndex(res => res.id === info.id);
  //     this.currentModif.infosOrLiens = infosOrLiens;
  //   }
  // }
  //
  // ajoutLigneModif() {
  //   this.modifications.push('');
  // }
  //
  // ajoutTheme(infoOrLien) {
  //   // ajouter alert pour demander le nom
  // }
  //
  // enregistrer() {
  //   const listeTextArea = this.divElement.nativeElement.children;
  //   const tmp = [];
  //
  //   for (const item of listeTextArea) {
  //     tmp.push(item.firstChild.value);
  //   }
  //   this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content = tmp;
  //
  //   this.httpService.uploadModifs(this.infos, this.id).toPromise()
  //     .then(() => {
  //       console.log('ok !?');
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }


  eventChange(event) {
    console.log(event.detail.value);
    this.currentValueSelect = event.detail.value;
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
