// In-memory storage for images (resets on server restart)
let images = [];

// Helper function to set CORS headers
function setCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: setCorsHeaders(),
  });
}

// POST handler - Save image
export async function POST(request) {
  try {
    const body = await request.json();
    const { image_url, source_url, created_at } = body;

    // Validate required fields
    if (!image_url) {
      return new Response(
        JSON.stringify({ error: 'image_url is required' }),
        {
          status: 400,
          headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate unique ID
    const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create image object
    const newImage = {
      id,
      image_url,
      source_url: source_url || null,
      created_at: created_at || new Date().toISOString(),
    };

    // Store in memory
    images.push(newImage);

    console.log('Image saved:', newImage.id, 'Total images:', images.length);

    return new Response(
      JSON.stringify({ success: true, data: newImage }),
      {
        status: 201,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save image', message: error.message }),
      {
        status: 500,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  }
}

// GET handler - Fetch all images
export async function GET() {
  try {
    // Return images in reverse chronological order (newest first)
    const sortedImages = [...images].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return new Response(
      JSON.stringify({ success: true, data: sortedImages }),
      {
        status: 200,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching images:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch images', message: error.message }),
      {
        status: 500,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  }
}

// DELETE handler - Remove image by ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'id parameter is required' }),
        {
          status: 400,
          headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Find and remove image
    const initialLength = images.length;
    images = images.filter((img) => img.id !== id);

    if (images.length === initialLength) {
      // Image not found
      return new Response(
        JSON.stringify({ error: 'Image not found' }),
        {
          status: 404,
          headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Image deleted:', id, 'Remaining images:', images.length);

    return new Response(
      JSON.stringify({ success: true, message: 'Image deleted' }),
      {
        status: 200,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete image', message: error.message }),
      {
        status: 500,
        headers: { ...setCorsHeaders(), 'Content-Type': 'application/json' },
      }
    );
  }
}

