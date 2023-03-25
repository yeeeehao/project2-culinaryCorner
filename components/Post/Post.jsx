// use in details interface

import { Avatar } from '@/components/Avatar';
import { RecipeImg } from '../RecipeImg';
import { Spacer } from '@/components/Layout';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Post.module.css';

const Post = ({ post, className }) => {
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);

  const text = post.content;
  const splitByNewline = text.split(/\r|\n/);
  const paragraphs = [];

  splitByNewline.forEach((paragraph) => {
    let currentLine = '';

    for (let i = 0; i < paragraph.length; i++) {
      currentLine += paragraph[i];

      if (currentLine.length >= 50) {
        paragraphs.push(currentLine.trim());
        currentLine = '';
      }
    }

    if (currentLine) {
      paragraphs.push(currentLine.trim());
    }
  });

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.Wrap}>
        <p className={styles.bigName}>{post.recipeName}</p>
        <Spacer size={3} axis="vertical" />
        <RecipeImg size={500} url={post.recipePicture}></RecipeImg>
        <Spacer size={1} axis="vertical" />
        <div className={styles.bigContent}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <Link href={`/user/${post.creator.username}`}>
        <a>
          <Container className={styles.creator}>
            <Avatar
              size={36}
              url={post.creator.profilePicture}
              username={post.creator.username}
            />
            <Container column className={styles.meta}>
              <p className={styles.name}>{post.creator.name}</p>
              <p className={styles.username}>{post.creator.username}</p>
            </Container>
          </Container>
        </a>
      </Link>
      <div className={styles.wrap}>
        <time dateTime={String(post.createdAt)} className={styles.timestamp}>
          {timestampTxt}
        </time>
      </div>
    </div>
  );
};

export default Post;
