import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfoResidenceModel} from '../shared/models/info-residence-model';
import {Langue} from '../shared/langue';
import {ListeModel} from '../shared/models/liste-model';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private base = 'https://nicob.ovh/';
  // private base = 'http://localhost:1080/';
  private baseUrl = this.base + 'apiJson/';

  constructor(private readonly http: HttpClient) {
  }

  // récupère le json en ligne
  getJson(nameText: string): Observable<InfoResidenceModel> {
    const url = this.baseUrl + nameText + '_' + Langue.value;
    return this.http.get<InfoResidenceModel>(url);
  }

  // récupère la liste de résidence en ligne
  getListe(): Observable<ListeModel> {
    const url = this.baseUrl + 'listeResidences';
    return this.http.get<ListeModel>(url);
  }

  // ajoute la résidence
  addRes(name: string, id: string): Observable<any> {
    const url = this.baseUrl + 'addRes/' + name + '/' + id;
    return this.http.get<any>(url);
  }

  // upload les modifications sur le serveur
  uploadModifs(data, id): Observable<any> {
    const url = this.baseUrl + 'upload/' + id + '/' + Langue.value;
    console.log(data);
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
    const url = this.base + 'mdpRp/' + mdp;
    return this.http.get<any>(url);
  }
}
