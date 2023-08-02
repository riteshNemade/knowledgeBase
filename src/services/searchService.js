const { db } = require('../config/database');
// services/searchService.js
const natural = require('natural');

const Content = require('../models/contentSchema');
const Article = require('../models/articleSchema');
const customError = require('../utils/customError');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const Typo = require('typo-js');

// Create a new Typo instance for English language
const dictionary = new Typo('en_US');

async function search(query) {
    try {
        // Process the user query with NLP (tokenization and stemming)
        const tokens = tokenizer.tokenize(query);
        const stemmedTokens = tokens.map((token) => stemmer.stem(token));
        const processedQuery = stemmedTokens.join(' ');
        const spellCheckedTokens = processedQuery
        .split(' ')
        .map((token) => dictionary.check(token) ? token : dictionary.suggest(token))
        .join(' ');
        
        console.log(spellCheckedTokens)

        const results = await Content.find({ $text: { $search: spellCheckedTokens } }); 
        let arrayOfResults = []
        for (const result of results) {
            articleName = await Article.findById(result.parentId);
            content = await Content.find({parentId: articleName._id})
            let truncatedContent = content.map((item) => item.text).join('\n');
            const maxLines = 10;
            const lines = truncatedContent.split('\n', maxLines);
            truncatedContent = lines.join(' ');
            let arr = {
                articleId: result.parentId,
                articleName: articleName.articleName,
                content: truncatedContent
            }
            arrayOfResults.push(arr);
        }
        return arrayOfResults;
    } catch (err) {
        console.log(err);
        throw new customError(err.message, 500)
    }

}


module.exports = {
    search
}