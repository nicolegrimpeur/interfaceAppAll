import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/Preferences';
import {Login} from '../shared/login';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  async setLogin() {
    await Preferences.set({
      key: 'mdp',
      value: Login.mdp,
    });
    await Preferences.set({
      key: 'isAll',
      value: String(Login.isAll),
    });
  }

  async getLogin() {
    const {value} = await Preferences.get({key: 'mdp'});
    return value;
  }

  async getIsAll() {
    const {value} = await Preferences.get({key: 'isAll'});
    return value === 'true';
  }
}
