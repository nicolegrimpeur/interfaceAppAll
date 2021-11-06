import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from './core/storage.service';
import {HttpService} from './core/http.service';
import {Display} from './shared/class/display';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display
  ) {
    this.checkIsLog().then();
  }

  async checkIsLog() {
    await this.storageService.getLogin()
      .then(result => {
        if (result === null) {
          this.storageService.setLogin().then();
        } else {
          this.httpService.checkMdpRp(result).toPromise()
            .then(() => {})
            .catch(err => {
              // si status = 200, alors le mot de passe est correct
              if (err.status === 200) {
                this.router.navigate(['/']).then();
              } else if (err.status === 201) {
                this.router.navigate(['/login']).then();
              } else {
                this.router.navigate(['/erreur']).then();
              }
            });
        }
      });
  }
}
