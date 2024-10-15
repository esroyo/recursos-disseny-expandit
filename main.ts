import { type Route, route, serveDir } from '@std/http';

const templateData: Record<string, string> = {
    formUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSdBSe7d_500v4sTZGadd8h5aQpbfWAnkwQs2bKke1mxtWTpxQ/viewform',
    copyYear: `${new Date().getFullYear()}`,
};

let finalHandler: ReturnType<typeof route>;
const routes: Route[] = [
    {
        pattern: new URLPattern({ pathname: '/' }),
        handler: async () => {
            const html = (await Deno.readTextFile('index.html'))
                .replace(
                    /\{\{\s*([^}\s]*)\s*\}\}/gm,
                    (_: string, key: string) => templateData[key] ?? '',
                );
            return new Response(html, {
                headers: { 'content-type': 'text/html' },
            });
        },
    },
    {
        pattern: new URLPattern({ pathname: '/data' }),
        handler: () => {
            const spreadsheet_id =
                '1vT4Y9bGVJ7HQVO-7Y8OnwWpwMie-dO7NFPZLIb2ykXs';
            const tab_name = 'Definitiu';
            const api_key = 'AIzaSyD6fW6TmhUP5_A-yPhjs4-sIlv_3ayMLMQ';
            const url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
                spreadsheet_id + '/values/' + tab_name + '?alt=json&key=' +
                api_key;

            return fetch(url);
        },
    },
    {
        pattern: new URLPattern({ pathname: '/static/*' }),
        handler: (req) => serveDir(req),
    },
];

function defaultHandler(_req: Request) {
    return new Response('Not found', { status: 404 });
}

finalHandler = route(routes, defaultHandler);

export default {
    fetch(req) {
        return finalHandler(req);
    },
} satisfies Deno.ServeDefaultExport;
