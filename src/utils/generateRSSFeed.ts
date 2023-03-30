import fs from 'fs';
import { Feed } from 'feed';
import { PostList, getSortedPost } from './mdx';

// adapted from https://blog.logrocket.com/adding-rss-feed-next-js-app/ 2023-03-29

export default async function generateRssFeed() {
  const allPosts: PostList[] | undefined = await getSortedPost();
  const site_url = 'localhost:3000';

  const feedOptions = {
    title: 'Blog | Feed',
    description: 'A blog',
    id: site_url,
    link: site_url,
    image: `${site_url}/logo.png`,
    favicon: `${site_url}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}.`,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
      json: `${site_url}/rss.json`,
      atom: `${site_url}/atom.xml`,
    },
  };

  const feed = new Feed(feedOptions);

  if (!allPosts) return;
  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title || '',
      id: `${site_url}/post/${post.slug}`,
      link: `${site_url}/post/${post.slug}`,
      description: post.description,
      date: new Date(post.date || '1970-01-01'),
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
  fs.writeFileSync('./public/rss.json', feed.json1());
  fs.writeFileSync('./public/atom.xml', feed.atom1());
}
