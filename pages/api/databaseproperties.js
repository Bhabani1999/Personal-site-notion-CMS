import { getDatabaseInfo } from '../../databasemodule';

export default async (req, res) => {
  try {
    const databaseInfo = await getDatabaseInfo(process.env.NOTION_DATABASE_ID);

    if (databaseInfo) {
      res.status(200).json(databaseInfo);
    } else {
      res.status(404).json({ error: 'Database not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
