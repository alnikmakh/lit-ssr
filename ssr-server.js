import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import middie from '@fastify/middie'; // Required to use Express-style middleware
import { createServer as createViteServer } from 'vite';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const fastify = Fastify({
    logger: true
  });

  // Register middie to use connect-style middleware
  await fastify.register(middie);

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so we can perform SSR
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  // If you're using Vite specific middleware modes, you can configure them here
  fastify.use(vite.middlewares);

  fastify.get('*', async (req, reply) => {
    const url = req.raw.url;

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry.
      const { renderApp } = await vite.ssrLoadModule('/src/entry-server.js');

      // 4. Render the app HTML.
      const app = await renderApp(url);
      const appHtml = await collectResult(app.html);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Send the rendered HTML back.
      reply.status(200).header('Content-Type', 'text/html').send(html);

    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      fastify.log.error(e);
      reply.status(500).send(e.message);
    }
  });

  return { fastify, vite };
}

// We need to install @fastify/middie
// Before running, run: pnpm install @fastify/middie
createServer().then(({ fastify }) => {
  fastify.listen({ port: 5173 }, (err) => { // Standard Vite port
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is listening... (message logged by Fastify logger)
  });
}); 