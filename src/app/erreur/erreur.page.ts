import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.page.html',
  styleUrls: ['./erreur.page.scss'],
})
export class ErreurPage implements OnInit {
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon

  constructor(
    private platform: Platform
  ) {
  }

  ngOnInit() {
  }

}
