class InfosModel {
  id: string;
  content: string;
}

class IdAffichageModel {
  liens: string;
  infos: string;
}

class BullesLienModel {
  title: string;
  href: string;
  logo: string;
}

class ColInfoModel {
  title: string;
  info1: string;
  info2: string;
}

export class InfoResidenceModel {
  langue: string;
  name: string;
  news: Array<string>;
  nameLiens: string;
  liens: Array<InfosModel>;
  nameInfos: string;
  infos: Array<InfosModel>;
  idAffichage: IdAffichageModel;
  bullesLien: Array<BullesLienModel>;
  colInfo: Array<ColInfoModel>;
}
