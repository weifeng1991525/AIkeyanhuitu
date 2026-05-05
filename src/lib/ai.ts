import OpenAI from 'openai';
import prisma from './db';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ============================================
// OpenAI Client Configuration (kuaipao.ai)
// ============================================
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://kuaipao.ai/v1',
});

// ============================================
// Type Definitions
// ============================================

export interface GenerateHypothesisParams {
  content: string;
  language?: 'zh' | 'en';
}

export interface GenerateRoadmapParams {
  content: string;
  language?: 'zh' | 'en';
}

export interface GenerateImageParams {
  prompt: string;
  style?: 'scientific' | 'schematic' | 'abstract' | 'realistic';
  size?: string;
  quality?: string;
  outputFormat?: 'png' | 'jpeg' | 'webp';
}

// ============================================
// Constants
// ============================================

const DEFAULT_IMAGE_MODEL = process.env.DALL_E_MODEL || 'gpt-image-2';
const DEFAULT_HYPOTHESIS_SIZE = '3840x2160'; // 4K, 16:9
const DEFAULT_ROADMAP_SIZE = '2160x3840'; // 4K, 9:16 vertical
const DEFAULT_QUALITY = 'high';

const GENERATED_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'generated');

// ============================================
// Helper Functions
// ============================================

/**
 * Ensure the generated images directory exists
 */
function ensureGeneratedImagesDir(): void {
  if (!fs.existsSync(GENERATED_IMAGES_DIR)) {
    fs.mkdirSync(GENERATED_IMAGES_DIR, { recursive: true });
  }
}

/**
 * Generate a random filename for saved images
 */
function generateRandomFilename(ext: string = 'png'): string {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(8).toString('hex');
  return `${timestamp}_${randomHex}.${ext}`;
}

/**
 * Save base64 image data to public/images/generated/ directory
 * Returns the URL path accessible from the browser
 */
export function saveBase64Image(base64Data: string, filename?: string): string {
  ensureGeneratedImagesDir();
  const ext = 'png';
  const finalFilename = filename || generateRandomFilename(ext);
  const filepath = path.join(GENERATED_IMAGES_DIR, finalFilename);
  fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
  return `/images/generated/${finalFilename}`;
}

// ============================================
// Core AI Functions
// ============================================

/**
 * Generate a research hypothesis with diagram prompt
 */
export async function generateHypothesis(
  params: GenerateHypothesisParams
): Promise<{ hypothesis: string; diagramPrompt: string; keyPoints: string[] }> {
  const systemPrompt = `You are an expert medical research scientist. Generate a clear, scientifically rigorous research hypothesis based on the user's input.

Your response MUST be valid JSON with this structure:
{
  "hypothesis": "The main hypothesis statement (scientific, precise, testable)",
  "diagramPrompt": "A detailed prompt for generating a hypothesis diagram (scientific illustration style, clean, professional, Nature journal quality)",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"]
}

Guidelines:
- Hypothesis should follow the format: "X affects Y through mechanism Z in [population/context]"
- Include specific biomarkers, pathways, or mechanisms when relevant
- Diagram prompt should describe a clean scientific figure with nodes, arrows, and labels
- Key points should include: rationale, expected outcome, clinical significance, and methodology approach
${params.language === 'zh' ? '- Respond in Chinese (中文)' : '- Respond in English'}`;

  const response = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: params.content },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

/**
 * Generate a technical research roadmap
 */
export async function generateRoadmap(
  params: GenerateRoadmapParams
): Promise<{ roadmap: string; phases: Array<{ phase: string; tasks: string[]; duration: string }> }> {
  const systemPrompt = `You are a senior medical research project manager. Generate a detailed technical roadmap for the research project.

Your response MUST be valid JSON with this structure:
{
  "roadmap": "Overall roadmap summary (2-3 paragraphs)",
  "phases": [
    {
      "phase": "Phase name",
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "duration": "Duration estimate"
    }
  ]
}

Guidelines:
- Break down into 4-6 logical phases
- Each phase should have 3-5 specific, actionable tasks
- Include milestones and deliverables
- Consider typical medical research timelines
${params.language === 'zh' ? '- Respond in Chinese (中文)' : '- Respond in English'}`;

  const response = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: params.content },
    ],
    temperature: 0.6,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

/**
 * Generate an image using gpt-image-2 via kuaipao.ai
 * Handles Base64 response (b64_json) and saves to local filesystem
 * Falls back to URL if b64_json is not available
 */
export async function generateImage(params: GenerateImageParams): Promise<{
  b64_json?: string;
  url?: string;
  revisedPrompt: string;
  localPath?: string;
}> {
  const stylePrefix: Record<string, string> = {
    scientific: 'Scientific illustration, clean vector style, professional medical diagram, white background, labeled, Nature journal quality, ',
    schematic: 'Schematic diagram, flowchart style, clean lines, minimal color palette, professional, ',
    abstract: 'Abstract scientific visualization, molecular biology aesthetic, artistic interpretation, ',
    realistic: 'Photorealistic scientific visualization, high detail, professional medical imaging style, ',
  };

  const fullPrompt = `${stylePrefix[params.style || 'scientific']}${params.prompt}`;

  try {
    const response = await openaiClient.images.generate({
      model: DEFAULT_IMAGE_MODEL,
      prompt: fullPrompt,
      n: 1,
      size: params.size || '1536x1024',
      quality: params.quality || DEFAULT_QUALITY,
      response_format: 'b64_json',
    } as any);

    const imageData = response.data[0];
    const result: { b64_json?: string; url?: string; revisedPrompt: string; localPath?: string } = {
      revisedPrompt: (imageData as any).revised_prompt || '',
    };

    // Handle Base64 response: save to local file
    if ((imageData as any).b64_json) {
      result.b64_json = (imageData as any).b64_json;
      const ext = params.outputFormat || 'png';
      const filename = generateRandomFilename(ext);
      result.localPath = saveBase64Image(result.b64_json, filename);
      console.log(`[AI] Image saved to ${result.localPath}`);
    }

    // Fallback: if URL is returned instead of b64_json
    if (!result.localPath && (imageData as any).url) {
      result.url = (imageData as any).url;
      console.log(`[AI] Image URL received: ${result.url}`);
    }

    return result;
  } catch (error: any) {
    console.error('[AI] Image generation error:', error?.message || error);

    // Retry without response_format if b64_json is not supported
    if (error?.message?.includes('response_format') || error?.status === 400) {
      console.log('[AI] Retrying image generation without response_format...');
      const response = await openaiClient.images.generate({
        model: DEFAULT_IMAGE_MODEL,
        prompt: fullPrompt,
        n: 1,
        size: params.size || '1536x1024',
        quality: params.quality || DEFAULT_QUALITY,
      });

      const imageData = response.data[0];
      const result: { b64_json?: string; url?: string; revisedPrompt: string; localPath?: string } = {
        revisedPrompt: (imageData as any).revised_prompt || '',
      };

      if ((imageData as any).b64_json) {
        result.b64_json = (imageData as any).b64_json;
        const ext = params.outputFormat || 'png';
        const filename = generateRandomFilename(ext);
        result.localPath = saveBase64Image(result.b64_json, filename);
      } else if ((imageData as any).url) {
        result.url = (imageData as any).url;
      }

      return result;
    }

    throw error;
  }
}

/**
 * Generate hypothesis image (default: 3840x2160, 4K 16:9, high quality)
 */
export async function generateHypothesisImage(params: GenerateImageParams) {
  return generateImage({
    ...params,
    size: params.size || DEFAULT_HYPOTHESIS_SIZE,
    quality: params.quality || DEFAULT_QUALITY,
    style: params.style || 'scientific',
  });
}

/**
 * Generate roadmap image (default: 2160x3840, 4K 9:16 vertical, high quality)
 */
export async function generateRoadmapImage(params: GenerateImageParams) {
  return generateImage({
    ...params,
    size: params.size || DEFAULT_ROADMAP_SIZE,
    quality: params.quality || DEFAULT_QUALITY,
    style: params.style || 'schematic',
  });
}

/**
 * Generate a custom image with user-provided prompt
 * No style prefix is added - the user has full control over the prompt
 */
export async function generateCustomImage(params: {
  prompt: string;
  size?: string;
  quality?: string;
  outputFormat?: 'png' | 'jpeg' | 'webp';
}): Promise<{
  url: string;
  revisedPrompt: string;
  localPath?: string;
}> {
  const result = await generateImage({
    prompt: params.prompt,
    style: 'scientific', // Minimal style prefix for custom prompts
    size: params.size || '1024x1024',
    quality: params.quality || DEFAULT_QUALITY,
    outputFormat: params.outputFormat || 'png',
  });

  // Prefer local path, fall back to URL
  const url = result.localPath || result.url || '';
  if (!url) {
    throw new Error('Image generation returned no usable output');
  }

  return {
    url,
    revisedPrompt: result.revisedPrompt,
    localPath: result.localPath,
  };
}

/**
 * Log a generation event to the database
 */
export async function logGeneration(params: {
  userId: string;
  type: 'HYPOTHESIS' | 'ROADMAP' | 'IMAGE';
  input: string;
  output: string;
  imageUrl?: string;
  tokensUsed?: number;
}): Promise<void> {
  try {
    await prisma.generationLog.create({
      data: {
        userId: params.userId,
        type: params.type,
        input: params.input,
        output: params.output,
        imageUrl: params.imageUrl,
        tokensUsed: params.tokensUsed || 0,
      },
    });
  } catch (error) {
    console.error('[AI] Failed to log generation event:', error);
    // Non-blocking: logging failure should not affect the main flow
  }
}
