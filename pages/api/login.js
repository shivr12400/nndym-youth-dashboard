import { createToken } from '../../utils/auth';

const validTemples = (process.env.NNDYM_TEMPLE_LOGINS || '')
  .split(',')
  .map(creds => {
    const [name, password] = creds.split(':');
    return { name, password };
  });

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { templeName, password } = req.body;
    const temple = validTemples.find(
      t => t.name && t.name.toLowerCase() === templeName.toLowerCase() && t.password === password
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