import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image, style, customInstructions } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Missing blueprint image' },
        { status: 400 }
      );
    }

    // 1. Analyze the blueprint using GPT-4o-mini
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: 'Analyze this architectural blueprint. Describe the layout, type of building (residential/commercial), key rooms visible, and any structural features like windows, stairs, or gardens. Provide a detailed summary for a 3D visualization prompt.' 
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const analysis = visionResponse.choices[0].message.content;

    // Style mapping
    const styles: Record<string, string> = {
      'Modern Minimalist': 'sleek modern architecture with floor-to-ceiling glass windows, white concrete, and minimalist landscaping',
      'Classic Luxury': 'traditional high-end finish with stone facades, ornate details, warm ambient lighting, and lush gardens',
      'Industrial Loft': 'raw aesthetic with exposed brick, steel beams, large factory-style windows, and polished concrete floors',
      'Mediterranean': 'warm terracotta tiles, white-washed walls, arched doorways, and vibrant coastal vegetation',
      'Eco-Friendly': 'sustainable design featuring vertical gardens, wooden accents, solar panels, and natural stone integration',
    };

    const styleDesc = styles[style] || styles['Modern Minimalist'];
    
    // 2. Generate Realistic Visualization using DALL-E 3
    const dallePrompt = `A high-end, realistic 3D architectural visualization based on this layout: ${analysis}. The style is ${styleDesc}. ${customInstructions || ''} Realistic textures, cinematic lighting, 8k resolution, professional architectural photography style, daylight. Transform the 2D blueprint into a stunning 3D reality.`;

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    if (!imageResponse.data || imageResponse.data.length === 0) {
      throw new Error('No visualization was generated');
    }

    const imageUrl = imageResponse.data[0].url;

    return NextResponse.json({
      imageUrl,
      analysis
    });

  } catch (error: any) {
    console.error('Colorization error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to colorize blueprint' },
      { status: 500 }
    );
  }
}
