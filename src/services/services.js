import axios from 'axios';
import {JSDOM} from 'jsdom';
import delay from 'delay';


    /**
     * Function to search products from amazon.com given a keyword.
     * @param {string} keyword The keyword to search products for.
     * @returns {Promise<Object>} A promise with an object containing the search results, where the keys are the product titles, and the values are objects with the product details.
     */
async function searchProducts(keyword) {
    const getElement = (doc, selector) => doc.querySelector(selector);
    const getElements = (doc, selector) => doc.querySelectorAll(selector);
    const productsList = {};
    const baseUrl = 'https://www.amazon.com';
    const searchUrl = `${baseUrl}/s?k=${keyword}`;
    const selectors = {
        title: '.a-size-medium.a-color-base.a-text-normal',
        imgUrl: 'img.s-image',
        rating: 'span.a-icon-alt',
        reviewsCount: 'span.a-size-base.s-underline-text',
        product: 'div[data-component-type="s-search-result"].s-asin',
        nextPageButton: '.s-pagination-container .s-pagination-strip  .a-unordered-list span.a-list-item .s-pagination-next',
    };

    console.log(`Searching products for the keyword: ${keyword}`);

    let doc;
    try {
        doc = await fetchData(searchUrl);
    } catch (error) {
        return console.error('Error fetching data:', error);
    }

    let currentPage = 1;

    while (true) {
        console.log(`Getting data from page ${currentPage} of results...`);

        let isNextPage;
        let productElements;
        try {
            isNextPage = getElement(doc, selectors.nextPageButton) ? true : false;
            productElements = getElements(doc, selectors.product);
        } catch (error) {
            console.error('Error getting products:', error);
        }

        try {
            productElements.forEach(productElement => {
                const title = getElement(productElement, selectors.title).textContent;
                const imgUrl = getElement(productElement, selectors.imgUrl) ? getElement(productElement, selectors.imgUrl).src : 'No image available';
                const rating = getElement(productElement, selectors.rating) ? getElement(productElement, selectors.rating).textContent : 'No rating';
                const reviewsCount = rating !== 'No rating' ? getElement(productElement, selectors.reviewsCount).textContent : 'No rating';

                productsList[title] = {
                    title: title,
                    rating: rating,
                    reviews: reviewsCount,
                    imageURL: imgUrl
                };
            })
        } catch (error) {
            console.error('Error processing elements:', error);
            return
        }
        if (isNextPage) {
            try {
                const nextPageURL = getElement(doc, selectors.nextPageButton) ? getElement(doc, selectors.nextPageButton).href : null;
                await delay(Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000); // Random delay from 1s to 3s to avoid being blocked by Amazon
                doc = await fetchData(baseUrl + nextPageURL);
                currentPage++;
            } catch (error) {
                console.error('Error fetching next page:', error);
                return;
            }
        } else {
            console.log('All data has been obtained');
            return productsList;
        }
    }
}

/**
 * Fetches the HTML document from a given URL using axios and parses it into a DOM object.
 * 
 * @param {string} url - The URL from which to fetch the HTML.
 * @returns {Promise<Document>} A promise that resolves to a DOM Document object representing the HTML of the fetched page.
 * 
 * @throws Will throw an error if the request fails.
 */

async function fetchData(url) {

    const headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'Host': 'www.amazon.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Site': 'cross-site',  // Pretend we came from another site
        'Referer': 'https://www.google.com/',  // Pretend we came from Google
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': 1,
    };
    const html = await axios.get(url, {headers});
    const dom = new JSDOM(html.data);
    const doc = dom.window.document;
    return doc;
}

export {
    searchProducts
};