const formatCentsToEuroString = (cents: number): string =>
  (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

export default formatCentsToEuroString;
