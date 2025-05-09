const puppeteer = require('puppeteer');

async function extrairInformacoes(videoUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.waitForSelector('h1.title', { timeout: 10000 });

    const dados = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
      };

      const getAttribute = (selector, attribute) => {
        const el = document.querySelector(selector);
        return el ? el.getAttribute(attribute) : null;
      };

      const getAllText = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.innerText.trim());
      };

      return {
        video: {
          titulo: getText('#title h1 yt-formatted-string'),
          descricao: getText('#description-inline-expander'),
          dataPublicacao: getText('#info-strings yt-formatted-string'),
          visualizacoes: getText('span.view-count'),
          likes: getText('like-button-view-model button .yt-spec-button-shape-next__button-text-content'),
          deslike: null, // youtube não permite
          hashtags: getAllText('yt-formatted-string a[href^="/hashtag/"]'),
          duracao: getText('.ytp-time-duration'),
          miniatura: getAttribute('link[rel="image_src"]', 'href'),
        },
        canal: {
          nome: getText('ytd-channel-name a'),
          url: getAttribute('ytd-channel-name a', 'href'),
          inscritos: getText('#owner-sub-count'),
          imagem: getAttribute('ytd-video-owner-renderer #avatar img', 'src')
        },
      };
    });

    console.log(JSON.stringify(dados, null, 2));
  } catch (error) {
    console.error('Erro ao extrair informações:', error);
  } finally {
    await browser.close();
  }
}

extrairInformacoes('https://www.youtube.com/watch?v=Bb6_OFpWOCo');