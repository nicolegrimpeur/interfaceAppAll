import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {Langue} from '../shared/langue';
import {ListeModel} from '../shared/models/liste-model';
import {Login} from "../shared/login";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.base + 'apiJson/';

  constructor(private readonly http: HttpClient) {
  }

  // récupère le json en ligne
  getJson(nameText: string): Observable<InfoResidenceModel> {
    const url = this.baseUrl + nameText + '_' + Langue.value;
    return this.http.get<InfoResidenceModel>(url);
  }

  // récupère le json en ligne
  getJsonAVerifier(nameText: string): Observable<InfoResidenceModel> {
    const url = this.baseUrl + 'aVerifier/' + nameText + '_' + Langue.value;
    return this.http.get<InfoResidenceModel>(url);
  }

  // récupère la liste de résidence en ligne
  getListe(): Observable<ListeModel> {
    const url = this.baseUrl + 'listeResidences/true';
    return this.http.get<ListeModel>(url);
  }

  // ajoute la résidence
  addRes(name: string, id: string): Observable<any> {
    const url = this.baseUrl + 'addRes/' + name + '/' + id;
    return this.http.get<any>(url);
  }

  // supprime la résidence
  removeRes(id: string): Observable<any> {
    const url = this.baseUrl + 'removeRes/' + id;
    return this.http.get<any>(url);
  }

  // upload les modifications sur le serveur
  uploadModifs(data, id): Observable<any> {
    // upload/residence + langue/est ce que c'est à vérifier ou pas
    const url = this.baseUrl + 'upload/' + id + '_' + Langue.value + '/' + String(!Login.isAll);
    return this.http.post(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  uploadImg(blobData, nom, format): Observable<any> {
    const formData = new FormData();
    formData.append('file', blobData, nom + '.' + format);
    formData.append('name', nom);

    const url = this.baseUrl + 'upload/';
    return this.http.post(url, formData);
  }

  checkMdpRp(mdp): Observable<any> {
    const url = environment.base + 'mdpRp';
    return this.http.post<any>(url, {mdp});
  }

  checkMdpAll(mdp): Observable<any> {
    const url = environment.base + 'mdpRp/all';
    return this.http.post<any>(url, {mdp});
  }

  downloadImg(id): Observable<any> {
    const url = this.baseUrl + 'get/residence' + id;
    return this.http.get<any>(url, {responseType: 'blob' as 'json'});
  }
}
