import puppeteer from 'puppeteer';
import fs from 'fs'

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-huur-in-antwerpen/11002";

interface Apartment {
  description: string,
  title: string,
  price: number,
  address: string,
}

const main = async (): Promise<Apartment> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    const description = document.querySelector('#description').innerHTML
        .replace(/[\r\n]/gm, '')
        .replace(/[<]br[^>]*[>]/gi,"");
    const title = document.querySelector('#detail-description-container > h2').innerHTML;
    const price = Number(document.querySelector('#detail-title > div.price').innerHTML.match(/\d+/)[0]);
    const address = document.querySelector('#detail-title > div.address').innerHTML;

    return {
      description,
      title,
      price,
      address,
    };
  });

  return items;
};

main().then(data => {
  fs.writeFileSync('./data.json', JSON.stringify(data));
});
