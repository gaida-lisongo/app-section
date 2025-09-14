export interface Message {
  nom: string;
  email: string;
  objet: string;
  telephone: string;
  contenu: string;
  status: 'PENDING' | 'OK';
  _id?: string;
}