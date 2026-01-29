const AI_GATEWAY_URL = 'https://ai.genfly.app';

interface OutfitChangeRequest {
  personImage: string; // base64 image
  clothingImage: string; // base64 image
}

interface OutfitChangeResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
}

// Convert base64 to a more compact form if needed
function processBase64Image(base64: string): string {
  // Remove data URL prefix if present
  if (base64.startsWith('data:')) {
    return base64;
  }
  return `data:image/png;base64,${base64}`;
}

export async function generateOutfitChange({
  personImage,
  clothingImage,
}: OutfitChangeRequest): Promise<OutfitChangeResponse> {
  try {
    const response = await fetch(`${AI_GATEWAY_URL}/api/v1/images/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        image: processBase64Image(personImage),
        prompt: `Virtual try-on: Replace the clothing on the person in this image with the clothing shown in the reference image. Keep the person's pose, body shape, face, and background exactly the same. Only change the clothing to match the reference garment. Make it look natural and realistic, with proper fit and lighting that matches the original photo. The reference clothing image is: ${processBase64Image(clothingImage)}`,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data[0]) {
      const imageData = data.data[0];
      // Handle both URL and base64 responses
      const resultImage = imageData.url || (imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null);

      if (resultImage) {
        return {
          success: true,
          resultImage,
        };
      }
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Outfit change error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Alternative: Use image generation with detailed prompt
export async function generateOutfitWithPrompt({
  personImage,
  clothingDescription,
}: {
  personImage: string;
  clothingDescription: string;
}): Promise<OutfitChangeResponse> {
  try {
    const response = await fetch(`${AI_GATEWAY_URL}/api/v1/images/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        image: processBase64Image(personImage),
        prompt: `Virtual try-on: Keep the person exactly the same (face, pose, body shape, background) but change their clothing to: ${clothingDescription}. Make it look natural and realistic with proper fit and matching lighting.`,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data[0]) {
      const imageData = data.data[0];
      const resultImage = imageData.url || (imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null);

      if (resultImage) {
        return {
          success: true,
          resultImage,
        };
      }
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Outfit generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
