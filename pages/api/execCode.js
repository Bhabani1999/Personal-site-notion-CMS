// pages/api/execCode.js

import { runInNewContext } from 'vm';

export default async function handler(req, res) {
  const { code } = req.body;

  try {
    // Execute the code in a new context
    const result = runInNewContext(code, {}, { timeout: 5000 });

    // Send the result as a JSON response
    res.status(200).json({ result });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
}
