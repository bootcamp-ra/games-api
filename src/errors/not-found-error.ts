export function notFoundError(resource?: string) {
  return {
    name: 'notFoundError',
    message: `${resource || 'Item'} not found!`,
  };
}
