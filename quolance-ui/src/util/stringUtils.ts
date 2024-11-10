export const formatEnumString = (enumObj: string): string => {
  return enumObj
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};
