import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // In a real app, use an environment variable

export function createToken(templeName) {
  return jwt.sign({ templeName }, SECRET_KEY, { expiresIn: '1m' });
}

export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return !!decoded;
  } catch (error) {
    return false;
  }
}