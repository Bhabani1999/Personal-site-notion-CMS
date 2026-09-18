import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });

const retrievePageData = async (slug) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
  });

  if (response.results.length === 0) {
    return null;
  }

  const pageId = response.results[0].id;
  const page = await notion.pages.retrieve({ page_id: pageId });
  const pageProperties = {
    id: page.id,
    pageTitle: page.properties["Name"]?.title[0]?.plain_text || "",
    pageDescription:
      page.properties["Description"]?.rich_text[0]?.plain_text || "",
    icon: page.icon?.emoji || "",
    creationDate: page.created_time,
    Tags: page.properties["Tags"]?.select?.name || "",
  };

  const blockResponse = await notion.blocks.children.list({ block_id: pageId });
  const content = [];

  const processBlock = async (block) => {
    switch (block.type) {
      case "image": {
        // Notion images can be either file-hosted or external
        const imageUrl =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;
        content.push({ type: "image", url: imageUrl });
        break;
      }
      case "heading_2": {
        const h2Content = block.heading_2.rich_text[0]?.text?.content || "";
        content.push({ type: "h2", text: h2Content });
        break;
      }
      case "toggle": {
        const toggleContent = block.toggle.rich_text[0]?.text?.content || "";
        content.push({ type: "toggle", text: toggleContent });
        break;
      }
      case "bulleted_list_item": {
        const bulletContent =
          block.bulleted_list_item.rich_text[0]?.text?.content || "";
        content.push({ type: "bullet", text: bulletContent });
        break;
      }
      case "numbered_list_item": {
        const numberedContent =
          block.numbered_list_item.rich_text[0]?.text?.content || "";
        content.push({ type: "numbered", text: numberedContent });
        break;
      }
      case "paragraph": {
        const paragraphContent = block.paragraph.rich_text
          .map((richText) => {
            if (richText.type !== "text") return null;
            return {
              contentType:
                richText.annotations.color === "gray" ? "sidenote" : "main",
              text: richText.text.content,
              href: richText.href,
            };
          })
          .filter(Boolean);
        content.push({ type: "paragraph", content: paragraphContent });
        break;
      }
      case "callout": {
        const calloutContent = block.callout.rich_text
          .map((richText) => {
            if (richText.type !== "text") return null;
            return { text: richText.text.content, href: richText.href };
          })
          .filter(Boolean);
        content.push({ type: "callout", content: calloutContent });
        break;
      }
      case "bookmark": {
        const bookmarkUrl = block.bookmark.url || "";
        content.push({ type: "bookmark", url: bookmarkUrl });
        break;
      }
      default:
        break;
    }
  };

  for (const block of blockResponse.results) {
    await processBlock(block);
  }

  return { properties: pageProperties, content };
};

export default retrievePageData;
