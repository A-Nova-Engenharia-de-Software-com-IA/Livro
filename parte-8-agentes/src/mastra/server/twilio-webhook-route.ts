import { registerApiRoute } from "@mastra/core/server";

export const twilioWebhookRoute = registerApiRoute("/webhook/twilio", {
  method: "POST",
  handler: async (c) => {
    const mastra = c.get("mastra");

    // Twilio manda form-encoded por padrão
    const body = await c.req.parseBody();

    const from = body["From"]; // ex: whatsapp:+5548...
    const text = body["Body"]; // mensagem do usuário
    const numMedia = Number(body["NumMedia"] || 0);

    console.log("📩 Twilio webhook recebido:", { from, text });

    const agent = mastra.getAgent("opsOrchestratorAgent");
    if (!agent) {
    return c.text("Agent not found", 500);
    }

    const userText = typeof text === "string" ? text : "[áudio recebido]";

    const result = await agent.generate([
    {
        role: "user",
        content: [
        {
            type: "text",
            text: `"${userText}"`,
        },
        ],
    },
    ]);

    var res = {
      output: (result as any)?.text || (result as any)?.outputText || JSON.stringify(result, null, 2),
    };
    console.log("🤖 Resposta do agente:", res);
    const reply = res.output || "Recebi sua mensagem!";
    // Resposta no formato TwiML (XML) — Twilio exige isso
    return c.text(
      `<Response>
         <Message>${reply}</Message>
       </Response>`,
      200,
      {
        "Content-Type": "text/xml",
      }
    );
  },
});

