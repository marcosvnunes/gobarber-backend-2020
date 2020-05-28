import IStorageProvider from '../models/IStorageProvider';

class FaketorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const fileIndex = this.storage.findIndex(
      storageFile => storageFile === file
    );

    this.storage.splice(fileIndex, 1);
  }
}

export default FaketorageProvider;
