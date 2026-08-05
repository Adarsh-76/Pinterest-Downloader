const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Supabase Admin Client (with service role key to bypass RLS)
const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

const app = express();
app.use(cors());
app.use(express.json());



// Health check route for UptimeRobot
app.get('/', (req, res) => {
  res.status(200).send('PinGrab Backend is Live!');
});


// Helper function: Extract using yt-dlp (Best for videos)
function extractWithYtDlp(url) {
  return new Promise((resolve, reject) => {
    const command = `yt-dlp -j "${url}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error('yt-dlp failed'));
      }
      try {
        const data = JSON.parse(stdout);
        const directUrl = data.url || (data.requested_formats && data.requested_formats[0].url);
        if (!directUrl) return reject(new Error('No media found by yt-dlp'));
        
        resolve({
          mediaUrl: directUrl,
          title: data.title || 'Pinterest Media',
          isVideo: data.ext === 'mp4' || data.acodec !== 'none'
        });
      } catch (e) {
        reject(new Error('Failed to parse yt-dlp data'));
      }
    });
  });
}

// Helper function: Extract using Axios + Cheerio (Best for images)
async function extractWithScraping(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    let imageUrl = $('meta[property="og:image"]').attr('content');
    let videoUrl = $('meta[property="og:video"]').attr('content');
    
    if (videoUrl) {
      return { mediaUrl: videoUrl, title: 'Pinterest Video', isVideo: true };
    } else if (imageUrl) {
      imageUrl = imageUrl.split('?')[0];
      imageUrl = imageUrl.replace(/\/(736x|236x|474x|564x|600x|800x|1200x|originals)\//, '/originals/');
      return { mediaUrl: imageUrl, title: 'Pinterest Image', isVideo: false };
    }
    
    throw new Error('No media tags found on page');
  } catch (error) {
    throw new Error('Scraping failed');
  }
}

// Main Extraction API Route
app.get('/api/extract', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await extractWithYtDlp(url);
    return res.json({ success: true, ...result });
  } catch (ytDlpError) {
    console.log('yt-dlp failed, falling back to scraping...');
    try {
      const result = await extractWithScraping(url);
      return res.json({ success: true, ...result });
    } catch (scrapeError) {
      console.error('Both extraction methods failed.');
      return res.status(500).json({ error: 'Could not extract media. The link might be private or broken.' });
    }
  }
});

// Secure Download Route
app.get('/api/download', async (req, res) => {
  const { url, isVideo } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const ext = isVideo === 'true' ? 'mp4' : 'jpg';
    const filename = `pinterest-${Date.now()}.${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    response.data.pipe(res);
  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).send('Failed to download file.');
  }
});

// Secure Account Deletion Route
app.post('/api/delete-account', async (req, res) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Server not configured for account deletion.' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing auth header' });

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: 'Invalid token' });

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) throw deleteError;

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error.message);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

// Use Render's dynamic port, or fallback to 3001 for local development
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
