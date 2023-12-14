export function PhoneMask (value: string) {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export function OrderArrayString (list: Array<string>) {
  return list.sort((prev, next) => {
    if (prev.toUpperCase() < next.toUpperCase()) return -1;
    else if (prev.toUpperCase() > next.toUpperCase()) return 1;
    else return 0;
  });
}
export function ExtractCategories (productList: Array<string>) {
  const list: Array<string> = [];
  productList.forEach((item) => {
      const indexOf = item.indexOf('-');
      list.push(item.slice(0, indexOf));
  });
  const listCategories = [...new Set(list)];
  return OrderArrayString(listCategories);
}