const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

async function video(videoUrl) {
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
                    deslike: null,
                    hashtags: getAllText('yt-formatted-string a[href^="/hashtag/"]'),
                    duracao: getText('.ytp-time-duration'),
                    miniatura: getAttribute('link[rel="image_src"]', 'href'),
                    url: window.location.href
                },
                canal: {
                    nome: getText('ytd-channel-name a'),
                    url: getAttribute('ytd-channel-name a', 'href'),
                    inscritos: getText('#owner-sub-count'),
                    imagem: getAttribute('ytd-video-owner-renderer #avatar img', 'src')
                },
            };
        });

        return dados;
    } catch (error) {
        console.error('Erro ao extrair informações:', error);
    } finally {
        await browser.close();
    }
}

async function channel(canalUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(canalUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('ytd-channel-name', { timeout: 10000 });

        const dados = await page.evaluate(() => {
            const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : null;
            };

            const getAttribute = (selector, attribute) => {
                const el = document.querySelector(selector);
                return el ? el.getAttribute(attribute) : null;
            };

            const videos = [];
            const videoElements = document.querySelectorAll('ytd-grid-video-renderer');
            videoElements.forEach((el) => {
                const titulo = el.querySelector('a#video-title') ? el.querySelector('a#video-title').innerText : '';
                const url = el.querySelector('a#video-title') ? el.querySelector('a#video-title').getAttribute('href') : '';
                const embedUrl = `https://www.youtube.com/embed/${url.split('v=')[1]}`;
                videos.push({
                    titulo,
                    embedUrl,
                });
            });

            const metadatas = document.querySelectorAll('yt-content-metadata-view-model span.yt-core-attributed-string');

            const inscritos = metadatas.length >= 2 ? metadatas[1].innerText.trim() : null;
            const totalVideos = metadatas.length >= 3 ? metadatas[2].innerText.trim() : null;

            return {
                canal: {
                    nome: getText('.yt-core-attributed-string--white-space-pre-wrap'),
                    imagem: getAttribute('yt-decorated-avatar-view-model img', 'src'),
                    inscritos,
                    total: { videos: totalVideos },
                    videos,
                },
            };
        });

        return dados;
    } catch (error) {
        console.error('Erro ao extrair informações do canal:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/info/video', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL do vídeo é obrigatória.');

    try {
        const data = await video(url);
        res.render('video', { data });
    } catch (e) {
        res.status(500).send('Erro ao processar o vídeo.');
    }
});

app.get('/info/canal', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL do canal é obrigatória.');

    try {
        const data = await channel(url);
        res.render('canal', { data: data.canal });
    } catch (e) {
        res.status(500).send('Erro ao processar o canal.');
    }
});

app.use((req, res, next) => {
    res.status(404).render('notfound');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});