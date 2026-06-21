import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cron from 'node-cron';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import googleTrends from 'google-trends-api';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Client (will error gracefully if key missing)
  const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GET /api/trends/fetch
  app.get('/api/trends/fetch', async (req, res) => {
    try {
      let allTrends: any[] = [];
      
      // 1. Fetch Google Trends (Saudi Arabia as default for Arabic content)
      try {
        const gtResults = await googleTrends.dailyTrends({ geo: 'SA' });
        let parsedResults;
        try {
          parsedResults = JSON.parse(gtResults);
        } catch (e) {
          console.warn('Google Trends returned invalid JSON (likely blocked or rate limited).', String(gtResults).substring(0, 50));
        }
        
        if (parsedResults && parsedResults.default && parsedResults.default.trendingSearchesDays) {
          const days = parsedResults.default.trendingSearchesDays;
          if (days.length > 0) {
            const searches = days[0].trendingSearches || [];
            searches.slice(0, 10).forEach((item: any, index: number) => {
              allTrends.push({
                id: `gt-${Date.now()}-${index}`,
                keyword: item.title.query,
                score: Math.max(50, 100 - index * 5),
                category: 'general',
                source: 'Google',
                used: false,
                date: new Date().toLocaleTimeString('ar-EG')
              });
            });
          }
        }
      } catch (gtError) {
        console.error('Google Trends error:', gtError);
      }
      
      // 2. Fetch YouTube Trends (if API key is present)
      if (process.env.YOUTUBE_DATA_API_KEY) {
        try {
          const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'snippet,statistics',
              chart: 'mostPopular',
              regionCode: 'SA', // Saudi Arabia
              maxResults: 10,
              key: process.env.YOUTUBE_DATA_API_KEY
            }
          });
          
          if (ytResponse.data && ytResponse.data.items) {
            ytResponse.data.items.forEach((item: any, index: number) => {
              // Deduplicate
              const isDuplicate = allTrends.some(t => t.keyword.toLowerCase() === item.snippet.title.toLowerCase());
              if (!isDuplicate) {
                allTrends.push({
                  id: `yt-${Date.now()}-${index}`,
                  keyword: item.snippet.title.split('|')[0].trim(), // Clean up title
                  score: Math.max(50, 98 - index * 4),
                  category: item.snippet.categoryId === '20' ? 'gaming' : 'entertainment',
                  source: 'YouTube',
                  used: false,
                  date: new Date().toLocaleTimeString('ar-EG')
                });
              }
            });
          }
        } catch (ytError) {
          console.error('YouTube API error:', ytError);
        }
      }
      
      // Sort by score
      allTrends.sort((a, b) => b.score - a.score);

      // Add fallback data if APIs fail or return no data
      if (allTrends.length === 0) {
        allTrends = [
          { id: `mock-1`, keyword: 'الذكاء الاصطناعي في 2026', score: 95, category: 'tech', source: 'Google', used: false, date: new Date().toLocaleTimeString('ar-EG') },
          { id: `mock-2`, keyword: 'ملخص مباريات اليوم', score: 88, category: 'sports', source: 'YouTube', used: false, date: new Date().toLocaleTimeString('ar-EG') },
          { id: `mock-3`, keyword: 'تحديثات التطبيقات الجديدة', score: 82, category: 'tech', source: 'Google', used: false, date: new Date().toLocaleTimeString('ar-EG') },
          { id: `mock-4`, keyword: 'أفضل الألعاب القادمة', score: 79, category: 'gaming', source: 'YouTube', used: false, date: new Date().toLocaleTimeString('ar-EG') },
          { id: `mock-5`, keyword: 'نصائح لزيادة الإنتاجية', score: 75, category: 'education', source: 'Google', used: false, date: new Date().toLocaleTimeString('ar-EG') }
        ];
      }
      
      res.json({
        success: true,
        trends: allTrends,
        newTrends: allTrends.length,
        skippedDuplicates: 0
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  // POST /api/generate/script
  app.post('/api/generate/script', async (req, res) => {
    try {
      const { keyword, duration, style, dialect, platform } = req.body;
      const ai = getAiClient();
      
      const prompt = `أنت كاتب محتوى محترف متخصص في إنشاء نصوص فيديوهات عربية رائجة للسوشيال ميديا.
المهمة: اكتب نصاً متكاملاً لفيديو بالعربية عن الموضوع التالي:
الموضوع: ${keyword}
المدة المطلوبة: ${duration} ثانية
الأسلوب: ${style}
اللهجة: ${dialect}
المنصة المستهدفة: ${platform}

متطلبات النص:
1. عدد الكلمات يجب أن يكون حوالي ${duration === 60 ? 130 : 250} كلمة لمطابقة مدة الفيديو.
2. ابدأ بـ HOOK قوي يجذب الانتباه في أول 3 ثواني.
3. قسّم النص إلى: مقدمة (20%) + جسم رئيسي (65%) + خاتمة مع CTA (15%).
4. استخدم معلومات حقيقية ودقيقة فقط.
5. النبرة يجب أن تكون احترافية وجذابة.
6. أضف إيموجي مناسبة بشكل معتدل.
7. النص يجب أن يكون سلساً عند النطق بصوت عالٍ.

الإخراج المطلوب كـ JSON فقط بالصيغة التالية:
{
  "title": "عنوان الفيديو الجذاب",
  "script": "النص الكامل للفيديو",
  "hook": "الجملة الأولى المستقلة",
  "sections": {
    "intro": "نص المقدمة",
    "body": "نص الجسم",
    "outro": "نص الخاتمة"
  },
  "estimatedDuration": 60,
  "wordCount": 130,
  "hashtags": ["#هاشتاق1", "#هاشتاق2"],
  "description": "وصف قصير للفيديو"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      
      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      res.json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || String(error) });
    }
  });

  // POST /api/generate/audio
  app.post('/api/generate/audio', async (req, res) => {
    // Mock ElevenLabs integration
    res.json({
      audioUrl: 'https://example.com/audio.mp3',
      durationSeconds: 60,
      fileSizeBytes: 1024 * 500
    });
  });

  // POST /api/generate/video
  app.post('/api/generate/video', async (req, res) => {
    // Mock video generation
    res.json({
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      fileSizeBytes: 1024 * 5000
    });
  });

  // GET /api/firebase/check-duplicate
  app.get('/api/firebase/check-duplicate', async (req, res) => {
    res.json({
      isDuplicate: false
    });
  });

  // Cron schedule for automatic automation if configured
  cron.schedule('0 0 */6 * * *', () => {
    console.log('Running automatic video generation cron');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
