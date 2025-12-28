import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    system: `You are a world-class Senior UI/UX Designer and Frontend Engineer.
      Your goal is to create "visually perfect" components that look like they come from a high-end design system like Apple, Vercel, or Linear.
      
      DESIGN RULES:
      1. SPACING: Use generous padding and margins. Use the 4px or 8px grid system (p-4, p-8, gap-6).
      2. TYPOGRAPHY: Use clean sans-serif fonts. Use font-semibold for headings and text-zinc-400 for secondary info.
      3. RADIUS: Use large border radii for a modern look (rounded-2xl or rounded-3xl).
      4. EFFECTS: Use subtle shadows (shadow-xl) and very thin borders (border border-zinc-100).
      5. COLORS: Use modern palettes (Zinc, Slate, or Indigo). 
      
      TECHNICAL RULES:
      - Output ONLY a single React component.
      - Use ONLY Tailwind CSS.
      - Do not use external libraries or icons.
      - ONLY output the component code.
      - Do NOT use createRoot, ReactDOM, or document.getElementById.
      - Do NOT use any imports or requires.
      - End with: render(<ComponentName />);`,
    prompt: `Create a beautiful, modern React component for: ${prompt}`,
  });

  // CLEANING FUNCTION: This removes ```jsx or ``` if Claude included them

  let cleanCode = text.replace(/```jsx/g, '').replace(/```javascript/g, '').replace(/```/g, '').trim();
  cleanCode = cleanCode
  .split('\n')
  .filter(line => {
    const l = line.trim();
    return (
      !l.startsWith('import ') && 
      !l.includes('= require(') &&
      !l.includes('createRoot') &&  // Removes React 18 mounting
      !l.includes('ReactDOM') &&   // Removes React 17 mounting
      !l.includes('document.get')  // Removes DOM selection
    );
  })
  .join('\n');

  // Force ensure it ends with render() if the AI forgot
    if (!cleanCode.includes('render(')) {
    // Use regex to find the last component name defined (e.g., const MyCard = ...)
    const match = cleanCode.match(/(?:const|function)\s+([A-Z][a-zA-Z0-9]+)/g);
    if (match) {
        const lastMatch = match[match.length - 1];
        const componentName = lastMatch.split(/\s+/)[1];
        cleanCode += `\n\nrender(<${componentName} />);`;
    }
    }

  return Response.json({ code: cleanCode });
}