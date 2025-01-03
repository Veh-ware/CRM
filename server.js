import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Directly setting the environment variables in the script
process.env.NODE_ENV = 'production'; // Set NODE_ENV to production
process.env.PORT = 3000; // Set PORT to 3000

const dev = process.env.NODE_ENV !== 'production'; // Determine if it's in development mode or not
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT}`);
  });
});
