import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Login} from './shared/login';
import {StorageService} from './core/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    this.checkIsLog().then();
  }

  async checkIsLog() {
    await this.storageService.getLogin().then(result => {
      if (result === null) {
        this.storageService.setLogin().then();
      } else {
        Login.isLog = Boolean(result);
      }

      if (!Login.isLog) {
        this.router.navigate(['/login']).then();
      }
    });
  }
}
