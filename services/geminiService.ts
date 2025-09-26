import { GoogleGenAI, Type } from "@google/genai";
import type { GroceryCategory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to show this error to the user.
  // For this environment, we'll throw to make it clear during development.
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const groceryListSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: "The category of the grocery items (e.g., Produce, Dairy & Eggs, Meat & Seafood, Pantry Staples, Frozen Foods, Bakery, Beverages, Household).",
      },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "A single grocery item. Should be concise and clear.",
        },
        description: "A list of grocery items belonging to this category."
      },
    },
    required: ["category", "items"],
  },
};

export const generateGroceryList = async (userInput: string): Promise<GroceryCategory[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following meal plan or list of items, please generate a categorized grocery list: "${userInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: groceryListSchema,
        systemInstruction: "You are an expert grocery list organizer. Your task is to take a user's raw, unstructured text about their meal plans or needed items and transform it into a well-categorized grocery checklist. Group similar items under logical categories like 'Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry', 'Frozen Foods', 'Bakery', and 'Household'. Ensure the output is a clean, structured list ready for shopping. If an item doesn't fit a common category, create a suitable one. Do not include quantities unless specified in the user input.",
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }

    const parsedList: GroceryCategory[] = JSON.parse(jsonText);
    return parsedList;
  } catch (error) {
    console.error("Error generating grocery list:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate grocery list from Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the grocery list.");
  }
};
