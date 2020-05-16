export default interface IHashProvider {
  generateHash(playload: string): Promise<string>;
  comparehash(playload: string, hashed: string): Promise<boolean>;
}
