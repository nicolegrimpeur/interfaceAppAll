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
        } else if (result !== '') {
          Login.mdp = result;
          await this.storageService.getIsAll().then(res => {
            if (res) {
              lastValueFrom(this.httpService.checkMdpAll(result))
                .then(() => this.thenCheckMdp(true))
                .catch(err => this.catchCheckMdp(err));
            } else {
              lastValueFrom(this.httpService.checkMdpRp(result))
                .then(() => this.thenCheckMdp(false))
                .catch(err => this.catchCheckMdp(err));
            }
          })
        } else {
          this.router.navigate(['/login']).then();
        }
      });
  }

  thenCheckMdp(isAll) {
    Login.isAll = isAll;
    this.router.navigate(['/home']).then();
  }

  catchCheckMdp(err) {
    if (err.status === 403) {
      this.router.navigate(['/login']).then();
    } else {
      this.router.navigate(['/erreur']).then();
    }
  }
}
