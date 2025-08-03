export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Operatore' | 'Analista' | 'Admin';
  token: string;
}
