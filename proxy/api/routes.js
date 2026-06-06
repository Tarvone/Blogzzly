import express from 'express';
import { convertPage, getAllArticles } from './controllers.js';
const app = express();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const articles = await getAllArticles();
    return res.status(200).json({ success: true, data: articles });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error!"});
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const posts = await getAllArticles();
    const post = posts.find(p => p.slug === slug)
    if (!post) return res.status(404).json({ success: false, message: "The Post Does not exist!" });

    const postId = post.id;
    const articleContent = await convertPage(postId);
    post.content = articleContent
    return res.status(200).json({ success: true, data: post });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error!"});
  }
})

export { router };