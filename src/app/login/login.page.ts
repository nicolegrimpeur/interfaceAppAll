import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../core/http.service";
import {Display} from "../shared/class/display";
import {Login} from "../shared/login";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputMdp') inputMdp;
  @ViewChild('iconMdp') iconMdp;

  public mdp = '';

  constructor(
    private router: Router,
    private httpService: HttpService,
    private display: Display
  ) { }

  ngOnInit() {
  }

  // permet d'afficher le mot de passe
  toggleMdp() {
    if (this.iconMdp.name === 'eye-outline') {
      this.iconMdp.name = 'eye-off-outline';
      this.inputMdp.type = 'password';
    }
    else {
      this.iconMdp.name = 'eye-outline';
      this.inputMdp.type = 'text';
    }
  }

  // événement au click du submit
  submit() {
    Login.mdp = this.mdp;
    // on vérifie que le mot de passe entré est correct
    this.httpService.checkMdpRp(this.mdp).toPromise().then()
      .catch(err => {
        // si status = 200, alors le mot de passe est correct
        if (err.status === 200) {
          this.display.display({code: 'Mot de passe correct', color: 'success'}).then();
          this.router.navigate(['/']).then();
        } else if (err.status === 201) {
          this.display.display('Mot de passe incorrect').then();
        } else {
          this.router.navigate(['/erreur']).then();
        }
      });
  }
}
