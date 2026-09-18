import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });

export const retrievePageProperties = async (databaseId) => {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results.map((page) => ({
    id: page.id,
    pageTitle: page.properties["Name"]?.title[0]?.plain_text || "",
    pageDescription:
      page.properties["Description"]?.rich_text[0]?.plain_text || "",
    icon: page.icon?.emoji || "",
    creationDate: page.created_time,
    Tags: page.properties["Tags"]?.select?.name || "",
    lastEdited: page.last_edited_time,
    slug: page.properties["Slug"]?.rich_text[0]?.plain_text || "",
  }));
};
