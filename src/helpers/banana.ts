import { GoogleGenAI } from "@google/genai";
import {v2 as cloudinary} from 'cloudinary';

export async function main(promptText: string,base64Image?:string) {


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


  const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: [
      { text:promptText},
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
        
      },
    ]
  });

   const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No valid response from Gemini");
    }

  for (const part of candidate.content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data; // base64 string
      const base64Image = `data:image/png;base64,${imageData}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "crezia", // optional: organize in a folder
      });
      return result.secure_url;
    }
}
}
