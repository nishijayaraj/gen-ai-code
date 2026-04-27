import { z } from "zod";
import api from "../api/client";

export const createOrderTool = {
  name: "create_order",
  description: "Create a new order",
  schema: z.object({
    title: z.string(),
    body: z.string(),
    userId: z.number(),
  }),

  handler: async (input: any) => {
    const response = await api.post(`/posts`, input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  },
};
