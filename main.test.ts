import { assertEquals } from '@std/assert';
import server from './main.ts';

Deno.test(async function serverFetch() {
    const req = new Request('https://expanded-design-resources.deno.dev');
    const res = await server.fetch(req);
    assertEquals((await res.text()).startsWith('<!doctype html>'), true);
});

Deno.test(async function serverFetchNotFound() {
    const req = new Request('https://expanded-design-resources.deno.dev/404');
    const res = await server.fetch(req);
    assertEquals(res.status, 404);
});

Deno.test(async function serverFetchStatic() {
    const req = new Request(
        'https://expanded-design-resources.deno.dev/static/script.js',
    );
    const res = await server.fetch(req);
    assertEquals((await res.text()).startsWith('var catsArray'), true);
    assertEquals(
        res.headers.get('content-type'),
        'text/javascript; charset=UTF-8',
    );
});
