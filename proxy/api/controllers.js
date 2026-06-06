import express from 'express';
const app = express();
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { databaseId, notionToken } from './config.js';
import { marked } from 'marked';

const notion = new Client({
  auth: notionToken,
});

export async function convertPage(pageId) {
  try {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const html = marked.parse(mdString.parent);
    return html
  } catch (error) {
    console.error('Conversion failed:', error);
    return error
  }
}

export const getAllArticles = async () => {
  const blogzzlyDB = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Published Date",
          direction: "descending"
        }
      ],
  });
  
  return blogzzlyDB.results.map((page) => ({
    id: page.id,
    title: page.properties?.Title?.title[0].plain_text,
    thumbnailImage: page.properties['Cover Image'].files[0]?.file?.url,
    thumbnailText: page.properties['Cover Image'].files[0]?.file?.name,
    description: page.properties['SEO Description']?.rich_text?.map(
      snippet => snippet.plain_text
    ).join('') || '',
    author: page.properties?.Author?.people[0]?.name,
    created: new Date(page.properties['Created At']?.created_time).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }),
    updated: new Date(page.properties['Updated At']?.last_edited_time).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }),
    postStatus: page.properties['Post Status']?.status?.name,
    published: new Date(page.properties['Published Date']?.date?.start).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }),
    slug: page.properties?.Slug?.rich_text[0]?.plain_text,
    tags: page.properties?.Tags?.multi_select.map((tag) => ({ name: tag.name, color: tag.color }))
  }))
  .filter((page) => (page.postStatus === "Published"));
};