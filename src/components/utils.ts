export const checkSource = (uri: number | string | { uri: string }) =>
  typeof uri === 'string' ? { source: { uri } } : { source: uri };
