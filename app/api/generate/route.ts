import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    system: `You are an expert React developer. 
         Output ONLY a React component using Tailwind CSS. 
         Do not use markdown backticks.
         IMPORTANT: You must always end the code by calling render(<Component />) with your component name.
         Example: 
         const MyCard = () => <div className="bg-blue-500">Hello</div>;
         render(<MyCard />);`,
    prompt: `Create a beautiful, modern React component for: ${prompt}`,
  });

  // CLEANING FUNCTION: This removes ```jsx or ``` if Claude included them
  const cleanCode = text
    .replace(/```jsx/g, '')
    .replace(/```javascript/g, '')
    .replace(/```/g, '')
    .trim();

  return Response.json({ code: cleanCode });
}