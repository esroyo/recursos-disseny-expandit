import { defineCollection, z } from "astro:content";

function getDriveUrlFromId(id: string) {
  return `https://lh3.googleusercontent.com/d/${id}=w400?authuser=1/view`;
}

function getImgSrc(str: string): string {
  try {
    var id = new URL(str).searchParams.get("id");
    if (id) {
      return getDriveUrlFromId(id);
    }
    var m = str.match(
      new RegExp("https://drive.google.com/file/d/([^/]*)/"),
    );
    if (m) {
      return getDriveUrlFromId(m[1]);
    }
  } catch { /* empty */ }
  return "/placeholder.jpg";
}

const resources = defineCollection({
  loader: async () => {
    const spreadsheetId = "1vT4Y9bGVJ7HQVO-7Y8OnwWpwMie-dO7NFPZLIb2ykXs";
    const tabName = "Definitiu";
    const apiKey = "AIzaSyD6fW6TmhUP5_A-yPhjs4-sIlv_3ayMLMQ";
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${tabName}?alt=json&key=${apiKey}`;
    const res = await fetch(url);
    const json = await res.json() as { values: Array<string[]> };
    return json.values.slice(1).map((
      [
        updatedAt,
        title,
        description,
        labels,
        link,
        category,
        year,
        authors,
        picture,
        status,
      ],
      id,
    ) => ({
      id: String(id),
      title,
      description,
      year,
      authors,
      labels,
      category,
      link,
      img: getImgSrc(picture),
      validated: status?.trim().length > 0,
      updatedAt,
    })).filter((item) => item.validated);
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    year: z.string(),
    authors: z.string(),
    labels: z.string(),
    category: z.string(),
    link: z.string().url(),
    img: z.string().url(),
    validated: z.boolean(),
    updatedAt: z.string(),
  }),
});

export const collections = { resources };
