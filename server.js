import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Serve files from the current directory (like my-element.js) under /public
fastify.register(fastifyStatic, {
  root: path.join(__dirname),
  prefix: '/public/',
  decorateReply: false
});

// Serve node_modules contents under /node_modules
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'node_modules'),
  prefix: '/node_modules/',
}); // No decorateReply: false needed on the last one

// Route to serve the HTML page
fastify.get('/', async (request, reply) => {
  // Ensure the import map is valid JSON (no comments inside!)
  return reply.type('text/html').send(`
<!DOCTYPE html>
<html>
<head>
    <title>Fastify + Lit</title>
    <!-- Adjusting paths to likely index.js -->
    <script type="importmap">
    {
      "imports": {
        "lit": "/node_modules/lit/index.js",
        "lit/": "/node_modules/lit/",
        "@lit/reactive-element": "/node_modules/@lit/reactive-element/index.js",
        "@lit/reactive-element/": "/node_modules/@lit/reactive-element/",
        "lit-html": "/node_modules/lit-html/index.js",
        "lit-html/": "/node_modules/lit-html/",
        "lit-html/polyfill-support.js": "/node_modules/lit-html/polyfill-support.js",
        "@lit/reactive-element/polyfill-support.js": "/node_modules/@lit/reactive-element/polyfill-support.js",
        "lit-element/lit-element.js": "/node_modules/@lit/reactive-element/index.js"
      }
    }
    </script>
    <script type="module" src="/public/my-element.js"></script>
</head>
<body>
    <h1>Welcome!</h1>
    <my-element></my-element>
    <p>Check the browser console (F12) for errors if the element still doesn't appear.</p>
</body>
</html>
  `);
});

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start(); 