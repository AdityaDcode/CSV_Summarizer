// src/services/api.ts

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface AnalysisRequest {
  csvData: CSVData;
  language?: string;
}

interface AnalysisResponse {
  insights: {
    english: string;
    hindi: string;
    kannada: string;
    marathi: string;
  };
  charts: Array<{
    id: string;
    title: string;
    type: string;
    image: string; // Placeholder for potential future chart generation
    description: string;
  }>;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_BASE_URL = "https://openrouter.ai/api/v1";

// Helper function to call the OpenRouter API
async function callOpenRouter(prompt: string, model = "google/gemini-pro-1.5"): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("VITE_OPENROUTER_API_KEY is not set in the environment variables.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024, // Limit the response size
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Error calling OpenRouter:", error);
    throw new Error(`Failed to communicate with AI service. ${error.message}`);
  }
}

// Function to generate insights from CSV data
async function generateInsights(csvData: CSVData): Promise<string> {
  const summary = {
    rows: csvData.rows.length,
    columns: csvData.headers,
    sample: csvData.rows.slice(0, 5),
  };
  const prompt = `Analyze the following CSV data and provide key insights. Be comprehensive and cover aspects like trends, distributions, and correlations. Data summary: ${JSON.stringify(summary, null, 2)}`;
  
  return callOpenRouter(prompt);
}

// Function to translate text to a specified language
async function translateText(text: string, targetLanguage: string): Promise<string> {
  const languageMap: { [key: string]: string } = {
    hindi: 'Hindi (हिंदी)',
    kannada: 'Kannada (ಕನ್ನಡ)',
    marathi: 'Marathi (मराठी)',
  };
  const targetLang = languageMap[targetLanguage] || targetLanguage;
  const prompt = `Translate the following data analysis text to ${targetLang}. Maintain technical accuracy and tone: "${text}"`;

  return callOpenRouter(prompt);
}

export const analyzeCSV = async (data: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const englishInsights = await generateInsights(data.csvData);

    // Translate insights into other languages
    const [hindi, kannada, marathi] = await Promise.all([
      translateText(englishInsights, 'hindi'),
      translateText(englishInsights, 'kannada'),
      translateText(englishInsights, 'marathi'),
    ]);

    // Mock chart data as chart generation is not implemented
    const charts = [
      {
        id: '1',
        title: 'Sales by Region (Example)',
        type: 'bar',
        image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'This is a sample chart. Dynamic chart generation is not yet implemented.'
      }
    ];

    return {
      insights: {
        english: englishInsights,
        hindi,
        kannada,
        marathi,
      },
      charts,
    };
  } catch (error: any) {
    console.error('Error analyzing CSV:', error);
    throw new Error(`Failed to analyze data. ${error.message}`);
  }
};

export const chatWithData = async (
  question: string,
  csvData: CSVData,
  language: string
): Promise<string> => {
  try {
    const context = {
      rows: csvData.rows.length,
      columns: csvData.headers,
      sample_data: csvData.rows.slice(0, 3),
      question: question,
      language: language,
    };

    const prompt = `
      You are a data analyst assistant. Answer the user's question about their CSV data in ${language}.
      
      Data Context:
      - Rows: ${context.rows}
      - Columns: ${context.columns}
      - Sample data: ${JSON.stringify(context.sample_data, null, 2)}
      
      User Question: ${question}
      
      Provide a detailed, helpful response in ${language}. Be specific and reference actual data patterns when possible.
    `;

    return await callOpenRouter(prompt);
  } catch (error: any) {
    console.error('Error in chatWithData:', error);
    throw new Error(`Failed to get a response from the AI. ${error.message}`);
  }
};