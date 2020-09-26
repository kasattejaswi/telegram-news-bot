const puppeteer = require('puppeteer')

const startArticleScraping = async(count) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    const context = browser.defaultBrowserContext()
    const page = await browser.newPage()
    await page.goto('https://inshorts.com/en/read', {
        waitUntil: "networkidle2",
    })
    let articles = await page.evaluate((count) => {
        function getHeadlines(currentCount) {
            let allSpans = document.getElementsByTagName('span')
            let insideCount = 0
            for (let i of allSpans) {
                if (i.getAttribute('itemprop') && i.getAttribute('itemprop') === "headline") {
                    insideCount++;
                }
            }
            if (insideCount < currentCount) {
                loadMoreNews()
                getHeadlines(currentCount)
            } else {
                return allSpans
            }
        }
        const allSpans = getHeadlines(count)
        console.log(count)
        let headlineArray = []
        for (let i of allSpans) {
            if (i.getAttribute('itemprop') && i.getAttribute('itemprop') === "headline") {
                if (headlineArray.length < count) {
                    headlineArray.push(i.textContent)
                } else {
                    break
                }
            }
        }
        console.log(headlineArray)
        return headlineArray
    }, count)
    await browser.close()
    return articles
}

module.exports = startArticleScraping