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

async function run(textInput, chatHistory) {
  const history = (chatHistory || []).map((item) =>{
    return{
      role: item.isBot ? 'model' : 'user',
      parts: [{text: item.text}]
    }
  })
  const chatSession = model.startChat({
    generationConfig,
    safetySetting,
    history: history,
  });

  const result = await chatSession.sendMessage(textInput);
  return result.response.text()
}

export default run;