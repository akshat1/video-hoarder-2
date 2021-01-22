/**
 * Base64 encode the given string.
 * @param input - the string to be encoded.
 * @returns Base64 encoded string.
 */
export const encode = (input: string): string =>
  Buffer.from(input, 'utf-8').toString('base64');

/**
 * Decode the given Base64 encoded string.
 * @param input - the Base64 encoded string to be decoded.
 * @returns decoded string.
 */
export const decode = (input: string): string =>
  Buffer.from(input, 'base64').toString('utf-8');
