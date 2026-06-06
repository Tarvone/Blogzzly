import 'dotenv/config'

const port = process.env.PORT
const nodeEnv = process.env.NODE_ENV
const databaseId = process.env.DATABASE_ID
const notionToken = process.env.NOTION_TOKEN
const frontendProd = process.env.FRONTEND_PROD
const frontendDev = process.env.FRONTEND_DEV

export { port, nodeEnv, databaseId, notionToken, frontendProd, frontendDev }