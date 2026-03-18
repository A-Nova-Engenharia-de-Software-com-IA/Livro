import { registerApiRoute } from "@mastra/core/server";
import {speechToTextFromBuffer} from './tools/openai'
import {downloadTwilioMedia} from './tools/twilio';
import { generatePreOpPDF } from "./tools/pdf-generator";

import path from "path";
import fs from "fs";

type Patient = {
  id: number;
  uuid: string;
  name: string;
  patient_uuid: string;
  patient_name: string;
  surgery_probable_date: string;
};

export const anestechPreWebhookRoute = registerApiRoute("/webhook/twilio", {
  method: "POST",
  handler: async (c) => {
    const mastra = c.get("mastra");
    const body = await c.req.parseBody();
    const from = body["From"]; // ex: whatsapp:+5548...
    const text = body["Body"]; // mensagem do usuário
    const numMedia = Number(body["NumMedia"] || 0);

    var userText = text;

    if (numMedia > 0) {
        const mediaUrl = body["MediaUrl0"] as string;
        const contentType = body["MediaContentType0"];
        console.log("📎 Veio mídia:", { mediaUrl, contentType });

        const audioBuffer = await downloadTwilioMedia(mediaUrl);
        console.log("🎧 Áudio baixado, tamanho:", audioBuffer.length);

        const transcript = await speechToTextFromBuffer(audioBuffer, "audio/ogg");
        userText = transcript;
        console.log("📝 Transcrição do áudio:", userText);
    } else {
        console.log("📩 Twilio webhook recebido:", { from, text });
    }

    const intent = await getIntent(userText as string, mastra);
  
    if (intent.intent === "CREATE_PREOP") {
      const fileName = await pdfGeneratorPreOp(userText as string, mastra);

       if (!fileName) {
          return c.text(`<Response><Message>Erro ao gerar PDF.</Message></Response>`, 200, {
            "Content-Type": "text/xml",
          });
        }

        const baseUrl = process.env.APP_BASE_URL;

        if (!baseUrl) {
          throw new Error("APP_BASE_URL não definida no .env");
        }

        const downloadUrl = `${baseUrl}/pdf/${fileName}`;

        return c.text(
          `<Response>
            <Message>📄 Seu relatório está pronto:</Message>
            <Message>${downloadUrl}</Message>
          </Response>`,
          200,
          { "Content-Type": "text/xml" }
        );
    } if (intent.intent === "LIST_PATIENTS") {
      const patients: Patient[] = await listPatients(userText as string);
      const checklist = 
      `Itens que devem constar no seu pré-operatório:

      1. Identificação (nome, idade, sexo, peso)
      2. Cirurgia/procedimento e local/lateralidade
      3. Classificação ASA
      4. Alergias
      5. Comorbidades
      6. Medicações em uso
      7. Cirurgias prévias/complicações anestésicas
      8. Hábitos (tabagismo/álcool/drogas)
      9. Jejum
      10. Via aérea (avaliação/antecedente de dificuldade)
      11. História familiar relevante`;

      const message =
        patients.length === 0
          ? "Nenhum paciente encontrado."
          : `📋 *Pacientes solicitados:*\n\n` +
            patients.map(p => `• ${p.patient_name}`).join("\n") +
            `\n\n--------------------------------\n\n${checklist}`;

      return c.text(
        `<Response>
          <Message>${message}</Message>
        </Response>`,
        200,
        {
          "Content-Type": "text/xml",
        }
      );
    } if (intent.intent === "SEND_AXREG") {
      // Aqui você implementaria a lógica para enviar o pré-operatório para o AxReg
      // Pode ser uma chamada de API, ou instruções para o usuário enviar o PDF manualmente, etc.
      return c.text(
        `<Response>
          <Message>PDF do PRÉ enviado para o AxReg</Message>
        </Response>`,
        200,
        {
          "Content-Type": "text/xml",
        }
      );
    }
    else {
      console.log("intent unknown:", intent.intent);
    }

    return c.text(
      `<Response>
         <Message>Em que posso ajudar? Listar pacientes, Realizar pré operatório, Enviar pré para AxReg</Message>
       </Response>`,
      200,
      {
        "Content-Type": "text/xml",
      }
    );
  },
});

async function listPatients(userText: string) {
  return await listPatientsFromAxReg()
}

async function pdfGeneratorPreOp(userText: string, mastra: any): Promise<string | null> {
  const agent = mastra.getAgent("anestechPreopAgent");

  const result = await agent.generate([
    {
      role: "user",
      content: [{ type: "text", text: userText }],
    },
  ]);

  const raw =
    (result as any)?.text ||
    (result as any)?.outputText ||
    result;

  const qaArray =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  console.log("✅ JSON convertido:", qaArray.length, "itens");

  try {
    // cria pasta se não existir
    const pdfDir = path.resolve(process.cwd(), "pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    // nome único
    const fileName = `preop-${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);

    await generatePreOpPDF(qaArray, filePath);

    console.log("✅ PDF gerado:", filePath);

    return fileName; // 👈 retorna só o nome
  } catch (err) {
    console.error("❌ Erro ao gerar PDF:", err);
    return null;
  }
}

async function getIntent(userText: string, mastra: any) {
  const agent = mastra.getAgent("anestechIntentAgent");

  const result = await agent.generate([
    {
      role: "user",
      content: [{ type: "text", text: userText }],
    },
  ]);

  // Extrai o texto retornado pelo modelo
  const raw =
    (result as any)?.text ||
    (result as any)?.outputText ||
    result;

  console.log("🤖 Resposta bruta:", raw);

  // Converte string JSON para objeto real
  const parsed =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  return parsed;
}


// Configuration
const baseUrl = process.env.AXREG_BASE_URL!;
const email = process.env.AXREG_EMAIL!;
const password = process.env.AXREG_PASSWORD!;

async function listPatientsFromAxReg() {
  try {
    // 1. Authentication
    //console.log('🔐 Authenticating...');
    const authResult = await fetch(`${baseUrl}/app/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!authResult.ok) {
      throw new Error(`Auth failed: ${authResult.status} ${authResult.statusText}`);
    }

    const authJson = await authResult.json();
    //console.log('✅ Authentication successful:', authJson);

    // Extract token from auth response
    const basicToken = authJson.token || authJson.accessToken || authJson.access_token;

    if (!basicToken) {
      throw new Error('No token found in auth response');
    }

    // Get user's institutions to determine institution_id
    //console.log('🏥 Getting user institutions...');
    const institutionsResult = await fetch(`${baseUrl}/app/institutions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicToken,
      },
    });

    if (!institutionsResult.ok) {
      throw new Error(
        `Get institutions failed: ${institutionsResult.status} ${institutionsResult.statusText}`
      );
    }

    const institutions = await institutionsResult.json();
    //console.log('✅ User institutions:', institutions);

    // Get the first institution ID
    const institutionId = 1;

    if (!institutionId) {
      throw new Error('No institutions found for user');
    }

    //console.log(`🔄 Getting institution-scoped token for institution: ${institutionId}...`);

    // Get institution-scoped token
    const refreshResult = await fetch(`${baseUrl}/app/refresh-token/institution/${institutionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicToken,
      },
    });

    if (!refreshResult.ok) {
      throw new Error(`Refresh token failed: ${refreshResult.status} ${refreshResult.statusText}`);
    }

    const refreshJson = await refreshResult.json();
    //console.log('✅ Institution-scoped token obtained:', refreshJson);

    // Extract the new token with institution context
    const institutionToken =
      refreshJson.token || refreshJson.accessToken || refreshJson.access_token;

    if (!institutionToken) {
      throw new Error('No institution token found in refresh response');
    }

    // Common headers for authenticated requests with institution context
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: institutionToken,
      Timezone: 'America/Sao_Paulo',
    };

    // 2. Test schedules endpoint with search (triggers main endpoint)
    //console.log('\n📅 Testing schedules with search...');
    const searchSchedulesResult = await fetch(
      `${baseUrl}/app/v3/schedules?page=1&limit=10&type=all`,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );

    if (!searchSchedulesResult.ok) {
      throw new Error(
        `Search schedules failed: ${searchSchedulesResult.status} ${searchSchedulesResult.statusText}`
      );
    }

    const searchSchedulesJson = await searchSchedulesResult.json();
    //console.log('✅ Search schedules result:', searchSchedulesJson);

    const simplifiedList = searchSchedulesJson.map((item: any) => ({
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      patient_uuid: item.patient_uuid,
      patient_name: item.patient_name,
      surgery_probable_date: item.surgery_probable_date,
    }));

    //console.log('✅ Search schedules result:', simplifiedList);

    return simplifiedList
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

export const downloadPdfRoute = registerApiRoute("/pdf/:file", {
  method: "GET",
  handler: async (c) => {
    console.log("📥 Download PDF request:", c.req.param("file"));
    const fileName = c.req.param("file");
    const filePath = path.resolve(process.cwd(), "pdfs", fileName);

    if (!fs.existsSync(filePath)) {
      return c.text("Arquivo não encontrado", 404);
    }

    const fileBuffer = fs.readFileSync(filePath);

    return c.body(fileBuffer, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });
  },
});