// backend/cosmos.js
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("chatdb");
const container = database.container("messages");

module.exports = container;