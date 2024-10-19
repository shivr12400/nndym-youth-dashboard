import { createToken } from '../../utils/auth';

const validTemples = [
  { name: '1', password: '2' },
  { name: 'Tirupati Balaji', password: 'tirupati456' },
  { name: 'Meenakshi Temple', password: 'madurai789' },
  { name: 'Kashi Vishwanath', password: 'varanasi101' },
  { name: 'Jagannath Temple', password: 'puri202' }
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { templeName, password } = req.body;
    const temple = validTemples.find(
      t => t.name.toLowerCase() === templeName.toLowerCase() && t.password === password
    );

    if (temple) {
      const token = createToken(temple.name);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}