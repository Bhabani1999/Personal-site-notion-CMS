// pages/api/content.js
import notionContentModule from '../../notioncontentModule';

const contentHandler = async (req, res) => {
  try {
    const postId = req.query.id; // Retrieve the numeric identifier from the query string
    const contentData = await notionContentModule(postId); // Pass postId to your content module

    // Send the content data as a JSON response
    res.status(200).json(contentData);
  } catch (error) {
    console.error('Error fetching content data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default contentHandler;
