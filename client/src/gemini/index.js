import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
// import fs from "fs";
// import mime from "mime-types"

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

async function run(textInput) {
  const chatSession = model.startChat({
    generationConfig,
    safetySetting,
    history: [],
  });

  const result = await chatSession.sendMessage(textInput);
  // TODO: Đoạn code dưới đây cần được cập nhật cho ứng dụng phía client.
  // const candidates = result.response.candidates;
  // for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
  //   for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
  //     const part = candidates[candidate_index].content.parts[part_index];
  //     if (part.inlineData) {
  //       try {
  //         const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
  //         fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
  //         console.log(`Output written to: ${filename}`);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }
  // }
  console.log(result.response.text());
}

export default run;