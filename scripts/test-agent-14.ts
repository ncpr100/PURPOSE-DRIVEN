import { executeAgent } from "../lib/agents/executor";
async function main() {
  console.log("🧪 Testing Agent 14 (SRE) with OpenRouter...");
  try {
    const result = await executeAgent(14);
    console.log("✅ Execution successful");
    console.log("📊 Result:", JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error("❌ Test failed:", error.message || error);
    process.exit(1);
  }
}
main();
