import { z } from "zod";
import api from "../api/client";

export const getUserTool = {
  name: "get_user",
  description: "Fetch a user by ID",
  schema: z.object({
    userId: z.number().describe("ID of the user"),
  }),

  handler: async ({ userId }: { userId: number }) => {
    const response = await api.get(`/users/${userId}`);
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
