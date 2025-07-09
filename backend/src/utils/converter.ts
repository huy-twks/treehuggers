export function b64ToObject (b64: string) {
  return !b64 ? {} : JSON.parse(Buffer.from(b64, 'base64').toString('ascii'))
}