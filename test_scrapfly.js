require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');
const cheerio = require('cheerio');

async function testLinkedIn() {
  const scrapflyKey = process.env.SCRAPFLY_API_KEY;
  const targetUrl = 'https://www.linkedin.com/company/opportunities-for-youth-organization/posts/';
  const encodedUrl = encodeURIComponent(targetUrl);
  
  // Notice we use asp=true and render_js=true
  const apiUrl = `https://api.scrapfly.io/scrape?key=${scrapflyKey}&url=${encodedUrl}&asp=true&render_js=true`;
  
  try {
    console.log("Fetching LinkedIn via Scrapfly...");
    const response = await axios.get(apiUrl, { timeout: 30000 });
    const html = response.data.result.content;
    
    // Save raw HTML for analysis
    require('fs').writeFileSync('linkedin_raw.html', html);
    
    // Check if we hit an auth wall
    const $ = cheerio.load(html);
    console.log("Title of page:", $('title').text());
    
    // Try finding some posts 
    const posts = $('div.feed-shared-update-v2, div[data-urn]');
    console.log(`Found ${posts.length} potential post elements.`);
    
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testLinkedIn();
