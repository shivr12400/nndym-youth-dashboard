import { createToken } from '../../utils/auth';

const validTemples = [
  { name: 'snj@nndym.org', password: 'KFWhJJx(1EK.s;NkW1su' },
  { name: 'colonia@nndym.org', password: 'w!v(N0V93!-_I8U&Ol72' },
  { name: 'bowlinggreen@nndym.org', password: '4Diy#ci74:I/rFaLH92' },
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