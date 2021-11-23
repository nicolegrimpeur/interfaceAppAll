import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from './core/storage.service';
import {HttpService} from './core/http.service';
import {lastValueFrom} from 'rxjs';
import {Login} from "./shared/login";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private httpService: HttpService
  ) {
    this.checkIsLog().then();
  }

  async checkIsLog() {
    await this.storageService.getLogin()
      .then(async result => {
        if (result === null) {
          this.storageService.setLogin().then();
        // } else if {
        } else if (result !== '') {
          Login.mdp = result;
          await this.storageService.getIsAll().then(res => {
            if (res) {
              lastValueFrom(this.httpService.checkMdpAll(result)).then()
                .catch(err => this.catchCheckMdp(err, true));
            } else {
              lastValueFrom(this.httpService.checkMdpRp(result)).then()
                .catch(err => this.catchCheckMdp(err, false));
            }
          })
        } else {
          this.router.navigate(['/login']).then();
        }
      });
  }

  catchCheckMdp(err, isAll) {
    // si status = 200, alors le mot de passe est correct
    if (err.status === 201) {
      this.router.navigate(['/login']).then();
    } else if (err.status == 200) {
      Login.isAll = isAll;
    } else {
      this.router.navigate(['/erreur']).then();
    }
  }
}
