// elasticsearchConnection.js

const { Client } = require('@elastic/elasticsearch');

// Elasticsearch client configuration
const client = new Client({ node: 'http://localhost:9200' });

module.exports = client;
