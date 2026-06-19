export const formatters = {
  number: (n: number) => new Intl.NumberFormat('fr-FR').format(n),

  percent: (n: number, decimals = 1) => `${n.toFixed(decimals)}%`,

  date: (d: string | Date) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(d)),

  currency: (amount: number, currency = 'XOF') =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount),
};
