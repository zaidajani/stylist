import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { occasion, weather, styleVibe, customPreferences } = await req.json();

    if (!occasion || !weather) {
      return NextResponse.json(
        { error: 'Missing occasion or weather' },
        { status: 400 }
      );
    }

    // 1. Generate Style Analysis using GPT-4o-mini
    const styleResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a high-end celebrity fashion stylist. 
          Your task is to:
          1. Recommend a complete outfit for a specific occasion and weather.
          2. Include main clothing items, shoes, and accessories (watch, jewelry, bag).
          3. Explain the style rationale (why this works for the weather/occasion).
          4. Describe the color palette.
          
          Return your response in strict JSON format:
          {
            "outfitDescription": "...",
            "items": ["list of key items"],
            "rationale": "...",
            "palette": ["list of colors"],
            "dallePrompt": "A professional high-fashion mood board containing..."
          }`
        },
        {
          role: 'user',
          content: `Occasion: ${occasion}
          Weather: ${weather}
          Vibe: ${styleVibe}
          Extra Preferences: ${customPreferences || 'None'}
          
          Requirements for DALL-E prompt:
          - High-end fashion mood board style.
          - Professional studio lighting.
          - Aesthetic arrangement of clothing items and accessories.
          - Clean, elegant composition.
          - No people, just the flatlay or mannequin arrangement.
          - 8k resolution, Vogue aesthetic.`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(styleResponse.choices[0].message.content || '{}');

    // 2. Generate Style Visual using DALL-E 3
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: analysis.dallePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    if (!imageResponse.data || imageResponse.data.length === 0) {
      throw new Error('No style board was generated');
    }

    const imageUrl = imageResponse.data[0].url;

    return NextResponse.json({
      imageUrl,
      analysis: {
        outfitDescription: analysis.outfitDescription,
        items: analysis.items,
        rationale: analysis.rationale,
        palette: analysis.palette
      }
    });

  } catch (error: any) {
    console.error('Stylist error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate style' },
      { status: 500 }
    );
  }
}
