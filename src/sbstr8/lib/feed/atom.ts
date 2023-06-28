import urlJoin from 'url-join';
import {
  getSortedPost,
  getLastModified,
  defaultPostPath,
} from '@/sbstr8/lib/post';
import { CookedPostMetadata } from '@/sbstr8/lib/types/post';
import { Feed } from 'feed';
import { pick, map, pluck } from 'ramda';

import cfg, { defaultAuthor } from '@/../sbstr8.config';

const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
const stylesheetLink =
  '<?xml-stylesheet href="/feed/style.xsl" type="text/xsl"?>';
const addStylesheetLink = (feed: string) =>
  feed.replace(xmlHeader, `${xmlHeader}\n${stylesheetLink}`);
const feedPerson = pick(['link', 'name']);
const feedPeople = map(feedPerson);
const pluckContributors = pluck('contributors');
const currentDate = new Date();
export function GET() {
  const posts = getSortedPost();
  const updated = getLastModified(posts);
  const feed = new Feed({
    copyright: cfg.copyright,
    description: cfg.description,
    id: cfg.link,
    image: urlJoin(cfg.link, cfg.image || '/image/image.webp'),
    favicon: cfg.icon,
    language: cfg.language,
    link: cfg.link,
    title: cfg.title,
    updated,
  });
  (posts || []).forEach(
    ({
      slug,
      authors,
      updated,
      created,
      image,
      thumbnail,
      contributions,
      description,
      title,
    }: CookedPostMetadata) => {
      const pic = thumbnail || image;
      console.log(pic ? urlJoin(cfg.link, pic) : undefined);
      feed.addItem({
        author: feedPeople(authors || [defaultAuthor]),
        contributor: feedPeople(pluckContributors(contributions || [])),
        date: updated || created ? new Date(updated || created) : currentDate,
        description,
        image: pic ? urlJoin(cfg.link, pic) : undefined,
        link: urlJoin(cfg.link, defaultPostPath, slug),
        title,
      });
    },
  );
  return new Response(addStylesheetLink(feed.atom1()), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}
