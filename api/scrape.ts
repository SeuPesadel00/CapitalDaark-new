import * as cheerio from 'cheerio';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      throw new Error(`Falha ao acessar a URL. Status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Tentar pegar dados das Meta Tags OpenGraph (funciona em 99% dos sites)
    let title = $('meta[property="og:title"]').attr('content') || $('title').text();
    let image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
    
    // Limpar título gigantesco da Amazon/AliExpress
    if (title) {
      // Remover " | Amazon.com.br"
      title = title.replace(/\|.*$/i, '').trim();
      title = title.replace(/-.*AliExpress.*$/i, '').trim();
      title = title.replace(/Compre.*no AliExpress.*/i, '').trim();
    }

    // 2. Fallbacks de Imagem para Amazon (muitas vezes a meta tag falha e eles usam img#landingImage)
    if (!image && url.includes('amazon')) {
       image = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src');
    }
    
    // 3. Fallbacks de Preço (Tentar raspar, muito propício a falha, mas vale a tentativa)
    let price: string | null = null;
    
    if (url.includes('amazon')) {
      const priceElement = $('.a-price .a-offscreen').first().text(); // Ex: R$ 199,90
      if (priceElement) {
        price = priceElement.replace(/[^\d,]/g, ''); // Remove R$
      }
    } else if (url.includes('aliexpress')) {
      const priceElement = $('.price--currentPriceText--V8_y_b5').first().text();
      if (priceElement) {
        price = priceElement.replace(/[^\d,]/g, ''); 
      }
    }

    res.status(200).json({
      title,
      image,
      price,
      url
    });

  } catch (error: any) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: error.message || 'Falha ao extrair os dados da página' });
  }
}
