import { HashingServiceProtocol } from "./hashing.service";
import * as bcrypt from 'bcrypt';

export class BcryptService extends HashingServiceProtocol{
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}