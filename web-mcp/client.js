import axios from "axios";

async function callTool(tool, params) {
  const response = await axios.post("http://localhost:3000/mcp", {
    method: "callTool",
    params: { tool, arguments: params },
  });
  return response.data;
}

(async () => {
  console.log("Fetching user info...");
  const response1 = await callTool("getUserInfo", { userId: "123" });
  console.log(response1);

  console.log("\nUpdating user email...");
  const response2 = await callTool("updateUserEmail", {
    userId: "123",
    newEmail: "alice.new@example.com",
  });
  console.log(response2);
})();

