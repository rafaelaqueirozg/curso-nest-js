import { hash, genSalt, compare } from 'bcrypt';

export async function generateHashedPassword(
  password: string,
): Promise<string> {
  const salt = await genSalt();
  return hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}
