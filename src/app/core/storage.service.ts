import {Injectable} from '@angular/core';
import {Storage} from '@capacitor/storage';
import {Login} from '../shared/login';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  async setLogin() {
    await Storage.set({
      key: 'mdp',
      value: Login.mdp,
    });
    await Storage.set({
      key: 'isAll',
      value: String(Login.isAll),
    });
  }

  async getLogin() {
    const {value} = await Storage.get({key: 'mdp'});
    return value;
  }

  async getIsAll() {
    const {value} = await Storage.get({key: 'isAll'});
    return value === 'true';
  }
}
