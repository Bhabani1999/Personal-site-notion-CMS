import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });

export const getDatabaseInfo = async (databaseId) => {
  const response = await notion.databases.query({ database_id: databaseId });
  if (response.results.length > 0) {
    return {
      lastEditedTime: response.results[0].last_edited_time,
      createdTime: response.results[0].created_time,
    };
  }
  return null;
};
