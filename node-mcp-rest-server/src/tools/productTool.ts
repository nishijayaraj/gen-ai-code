import { z } from "zod";
import api from "../api/client";

export const searchProductsTool = {
  name: "search_products",
  description: "Search products by keyword",
  schema: z.object({
    query: z.string().describe("Search keyword"),
  }),

  handler: async ({ query }: { query: string }) => {
    const response = await api.get(`/posts`);

    const filtered = response.data.filter((item: any) =>
      item.title.includes(query),
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(filtered.slice(0, 5), null, 2),
        },
      ],
    };
  },
};
