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
  }

  async getLogin() {
    const {value} = await Storage.get({key: 'mdp'});
    return value;
  }
}
