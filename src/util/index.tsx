export const phoneMask = (value: string) => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export const orderArrayString = (list: string[])=> {
  return list.sort((prev, next) => {
    if (prev.toUpperCase() < next.toUpperCase()) return -1;
    else if (prev.toUpperCase() > next.toUpperCase()) return 1;
    else return 0;
  });
}