import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Function to convert File to base64
function fileToBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result == "string") {
        const base64 = reader.result!.split(',')[1];
        resolve(base64);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Main function to generate content
async function run(prompt: any, file: Blob) {
  try {
    const base64Image = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png",
      },
    };

    // console.log(imagePart)
    // Send the prompt and image to the model
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export default run;
