import { defineConfig } from 'vite';

// Cuentas de prueba del mock de login (solo desarrollo, no van al foro)
const MOCK_ACCOUNTS = [
  {
    user_id: 2,
    username: 'Ten Leechaiyapornkul',
    password: 'prueba-ten',
    avatar: 'https://placehold.co/100x100/673143/fff.png?text=TL',
  },
  {
    user_id: 3,
    username: 'Kim Taeyeon',
    password: 'prueba-taeyeon',
    avatar: 'https://placehold.co/100x100/25719c/fff.png?text=KT',
  },
];

const getMockUser = (req) => {
  const match = (req.headers.cookie || '').match(/(?:^|;\s*)mock_sid=(\d+)/);
  return match ? MOCK_ACCOUNTS.find((user) => user.user_id === Number(match[1])) : null;
};

const readBody = (req) =>
  new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(new URLSearchParams(body)));
  });

// Simula el login/logout de ForoActivo y la variable _userdata
const mockForumLogin = () => ({
  name: 'mock-forum-login',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, 'http://localhost');

      if (url.pathname === '/__mock/userdata.js') {
        const user = getMockUser(req);
        const userdata = user
          ? {
              session_logged_in: 1,
              user_id: user.user_id,
              username: user.username,
              avatar: `<img src="${user.avatar}" alt="" />`,
              avatar_link: user.avatar,
            }
          : { session_logged_in: 0, user_id: -1, username: 'Anonymous' };
        res.setHeader('Content-Type', 'text/javascript');
        res.setHeader('Cache-Control', 'no-store');
        res.end(`var _userdata = ${JSON.stringify(userdata)};`);
        return;
      }

      if (url.pathname !== '/login') return next();

      if (url.searchParams.has('logout')) {
        res.statusCode = 302;
        res.setHeader('Set-Cookie', 'mock_sid=; Path=/; Max-Age=0');
        res.setHeader('Location', '/indice.html');
        res.end();
        return;
      }

      if (req.method === 'POST') {
        const params = await readBody(req);
        const user = MOCK_ACCOUNTS.find(
          (account) =>
            account.username.toLowerCase() === (params.get('username') || '').trim().toLowerCase() &&
            account.password === params.get('password'),
        );
        if (user) {
          res.statusCode = 302;
          res.setHeader('Set-Cookie', `mock_sid=${user.user_id}; Path=/; HttpOnly`);
          res.setHeader('Location', '/indice.html');
          res.end();
          return;
        }
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<!doctype html><p>Usuario o contraseña incorrectos.</p>');
    });
  },
  transformIndexHtml: () => [
    { tag: 'script', attrs: { src: '/__mock/userdata.js' }, injectTo: 'head-prepend' },
  ],
});

export default defineConfig({
  root: 'src',
  appType: 'mpa', // multiple standalone HTML pages, no index.html/SPA fallback
  server: {
    open: '/indice.html', // adjust to whichever page you're actively working on
  },
  plugins: [mockForumLogin()],
});
