import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

export const messageError = (message: string)=> {
  let response = 'Houve um erro inesperado, tente mais tarde.';
  const errors = {
  'auth/invalid-login-credentials': 'Usuário/Senha incorreta',
  'auth/invalid-email': 'Favor informar um email válido.',
  'auth/email-already-in-use': 'Este e-mail já esta sendo utilizado',
  'auth/weak-password': 'A senha deve ter no mínimo 6 caracteres'
  }
  for (const [key, value] of Object.entries(errors)) {
    if(key === message) {
      response = value;
      break
    }
  }
  return response;
}

export type Market = {
  card: boolean;
  customName: string;
  daysWorking: string;
  delivery: boolean;
  location: string;
  phone: number;
  pix: boolean;
  products: string[];
  userID: string;
}

export interface CustomUser extends Market {
  name: string;
  email: string;
  password: string;
};

export default initializeApp(firebaseConfig);