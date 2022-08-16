import puppeteer from 'puppeteer'
import { Dappeteer, RECOMMENDED_METAMASK_VERSION } from '@chainsafe/dappeteer';
import * as dappeteer from '@chainsafe/dappeteer';

/*
dappeteer depends on LANG=en  (to wait some button, using englisht text matcher)
On mac OS,  you need to change system language setting to change locale to en.
*/
jest.setTimeout(30000)
let browser;
let metamask;
let page;

describe('Google', () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion: process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
    });    
    console.log("test launch fin");
    //const metamask = await dappeteer.setupMetamask(browser,{seed: "already blah birth blah since blah keep blah skirt blah any blah"});
    metamask = await dappeteer.setupMetamask(browser, {
      // optional, else it will use a default seed
      seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog',
      password: 'password1234',
    });
    console.log("test setup fin");
    //await metamask.addNetwork({networkName: "Avax",rpc: "https://api.avax.network/ext/bc/C/rpc",chainId: "43114",symbol: "AVX"})
    //await metamask.switchNetwork('Avax')
    page = await browser.newPage()    
    console.log("test newpage fin");
    await page.goto('https://google.com');
    console.log("test goto fin");
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });

  afterAll(async () => {
    browser.close();
  })
});

