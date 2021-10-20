import {Component, OnInit, ViewChild} from '@angular/core';
import {InfoResidenceModel} from "../../models/info-residence-model";

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent implements OnInit {
  @ViewChild('divElement') divElement;

  private id = '';
  public infos = new InfoResidenceModel();  // stockage du json
  public modifications = [];
  private currentModif = {id: '', infosOrLiens: ''};
  public currentValueSelect = '';

  constructor() { }

  ngOnInit() {}

  clickEvent(info, infosOrLiens) {
    console.log(info);
    if (this.modifications[0] === info.content[0]) {
      this.modifications = [];
      this.currentModif.id = '';
      this.currentModif.infosOrLiens = '';
    } else {
      this.modifications = [];
      for (const content of info.content) {
        this.modifications.push(content);
      }
      this.currentModif.id = this.infos[infosOrLiens].findIndex(res => res.id === info.id);
      this.currentModif.infosOrLiens = infosOrLiens;
    }
  }

  ajoutLigneModif() {
    this.modifications.push('');
  }

  ajoutTheme(infoOrLien) {
    // ajouter alert pour demander le nom
  }

  enregistrer() {
    const listeTextArea = this.divElement.nativeElement.children;
    const tmp = [];

    for (const item of listeTextArea) {
      tmp.push(item.firstChild.value);
    }
    this.infos[this.currentModif.infosOrLiens][this.currentModif.id].content = tmp;

    // this.httpService.uploadModifs(this.infos, this.id).toPromise()
    //   .then(() => {
    //     console.log('ok !?');
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

}
