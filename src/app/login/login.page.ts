import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../core/http.service";
import {Display} from "../shared/class/display";
import {Login} from "../shared/login";
import {StorageService} from "../core/storage.service";
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputMdp') inputMdp;
  @ViewChild('iconMdp') iconMdp;

  public mdp = '';
  public mdpAll = '';

  constructor(
    private router: Router,
    private httpService: HttpService,
    private display: Display,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
  }

  // permet d'afficher le mot de passe
  toggleMdp(iconMdp, inputMdp) {
    if (iconMdp.name === 'eye-outline') {
      iconMdp.name = 'eye-off-outline';
      inputMdp.type = 'password';
    } else {
      iconMdp.name = 'eye-outline';
      inputMdp.type = 'text';
    }
  }

  // événement au click du submit
  submit() {
    Login.mdp = this.mdp;
    Login.isAll = false;
    // on vérifie que le mot de passe entré est correct
    lastValueFrom(this.httpService.checkMdpRp(this.mdp))
      .then(() => this.thenSubmit())
      .catch(err => this.catchSubmit(err));
  }

  // événement au click du submitAll
  submitAll() {
    Login.mdp = this.mdpAll;
    Login.isAll = true;
    // on vérifie que le mot de passe entré est correct
    lastValueFrom(this.httpService.checkMdpAll(this.mdpAll))
      .then(() => this.thenSubmit())
      .catch(err => this.catchSubmit(err));
  }

  thenSubmit() {
    this.display.display({code: 'Mot de passe correct', color: 'success'}).then();
    this.storageService.setLogin().then(() => {
      this.router.navigate(['/']).then();
    });
  }

  catchSubmit(err) {
    if (err.status === 403) {
      this.display.display(err.error.message).then();
    } else {
      this.router.navigate(['/erreur']).then();
    }
  }
}
