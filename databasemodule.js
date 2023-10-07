const { Client } = require("@notionhq/client");
const dotenv = require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_KEY });

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const getDatabaseInfo = async (databaseId) => {
  try {
    const response = await notion.databases.query({ database_id: databaseId });
    if (response.results.length > 0) {
      const databaseInfo = {
        lastEditedTime: response.results[0].last_edited_time,
        createdTime: response.results[0].created_time,
      };
      return databaseInfo;
    } else {
      console.error("Database is empty or not found.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = {
  getDatabaseInfo,
};
