import * as React from 'react';
import ccn from '@sindresorhus/class-names';
import { mkShortDate } from '@/sbstr8/lib/post';
import { Post } from '@/sbstr8/lib/types/post';
import clss from './station.module.css';
import Image from '@/sbstr8/components/image';
import Link from '@/sbstr8/components/link';

export interface StationProps {
  post: Post;
  link: string;
  cut: 'primary' | 'secondary' | 'tertiary';
  authorClassName?: string;
  className?: string;
  dateClassName?: string;
  hookClassName?: string;
  imageClassName?: string;
  teaserClassName?: string;
  titleClassName?: string;
  style?: React.CSSProperties;
}
const defaultImage = '/image/image.webp';

const Story = ({
  link,
  post: {
    meta: { image, title, created, updated, authors },
    Hook,
    Teaser,
  },
  cut,
  className,
  imageClassName,
  authorClassName,
  titleClassName,
  dateClassName,
  teaserClassName,
  hookClassName,
  style,
}: StationProps) => {
  const date = mkShortDate(created, updated);

  return (
    <div className={ccn(clss[cut], className)} style={style}>
      <Link href={link}>
        <Image
          className={imageClassName}
          src={image || defaultImage}
          alt={`Image for post entitled ${title}`}
        />
      </Link>
      <h1 className={ccn(clss['title'], titleClassName)}>
        <Link href={link}>{title}</Link>
      </h1>
      <h2 className={ccn(clss['date'], dateClassName)}>{date}</h2>
      <h2 className={ccn(clss['author'], authorClassName)}>
        {(authors || []).join(', ')}
      </h2>
      <div></div>
      <div className={ccn(clss['teaser'], teaserClassName)}>
        <Teaser />
      </div>
      <div className={ccn(clss['hook'], hookClassName)}>
        <Hook />
      </div>
    </div>
  );
};

export default Story;