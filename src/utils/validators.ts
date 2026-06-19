export const validators = {
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Adresse email invalide',

  password: (v: string) =>
    v.length >= 8 ? null : 'Mot de passe trop court (8 caractères min.)',

  required: (v: string) =>
    v.trim().length > 0 ? null : 'Ce champ est obligatoire',
};
