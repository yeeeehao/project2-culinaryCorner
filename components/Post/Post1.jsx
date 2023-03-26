// use in recipe list interface

import { RecipeImg } from '../RecipeImg';
import { Spacer } from '@/components/Layout';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './Post.module.css';
import Link from 'next/link';

const Post = ({ post, className }) => {
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);

  const shortenedWords =
    post.content.length > 20 ? post.content.slice(0, 100) : post.content;
  return (
    <div className={clsx(styles.root, className)}>
      <Link
        key={post._id}
        href={`/user/${post.creator.username}/post/${post._id}`}
      >
        <a className={styles.wrap2}>
          <Container className={styles.creator}>
            <RecipeImg size={100} url={post.recipePicture}></RecipeImg>
            <Container column className={styles.meta}>
              <p className={styles.name}>{post.recipeName}</p>
              <Spacer size={0.2} axis="vertical" />
              <p className={styles.category}>{post.category}</p>
              <Spacer size={0.2} axis="vertical" />
              <p className={styles.content}>{shortenedWords}...</p>
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
