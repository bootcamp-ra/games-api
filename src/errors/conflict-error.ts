export function conflictError(resource?: string) {
  return {
    name: 'conflictError',
    message: `${resource || 'Item'} already exists!`,
  };
}
