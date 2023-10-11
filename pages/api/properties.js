// pages/api/properties.js
import { retrievePageProperties } from '../../notionModule';

export default async function handler(req, res) {
  try {
    const pageProperties = await retrievePageProperties(process.env.NOTION_DATABASE_ID);
    res.status(200).json(pageProperties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
