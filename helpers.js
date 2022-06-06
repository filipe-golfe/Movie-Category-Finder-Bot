export const removeAccentuation = (expression) => {
  return expression.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
