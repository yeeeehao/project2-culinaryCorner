// use in user recipe list interface

import { RecipeImg } from '../RecipeImg';
import { Spacer } from '@/components/Layout';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styles from './Post.module.css';
import { useCurrentUser } from '@/lib/user';
import { fetcher } from '@/lib/fetch';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { usePostPages } from '@/lib/post';
import { Button } from '../Button';
import { Input, Textarea } from '@/components/Input';
import { Select } from '@/components/Select';

const Post = ({ post, className }) => {
  const [isEditing, setIsEditing] = useState(false);

  const recipeNameRef = useRef();
  const contentRef = useRef();
  const categoryRef = useRef();
  const recipePictureRef = useRef();

  const [recipeImgHref, setRecipeImgHref] = useState(post.recipePicture);

  const onRecipeImgChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setRecipeImgHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const deletePost = async (postId) => {
    try {
      await fetcher(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      toast.success('Post has been deleted successfully');

      window.location.reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const { mutate } = usePostPages();

  const onSave = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData();
        formData.append('recipeName', recipeNameRef.current.value);
        formData.append('content', contentRef.current.value);
        formData.append('category', categoryRef.current.value);
        if (recipePictureRef.current.files[0]) {
          formData.append('recipePicture', recipePictureRef.current.files[0]);
        }
        await fetch(`/api/posts/${post._id}`, {
          method: 'PATCH',
          body: formData,
        });

        mutate();
        toast.success('Post has been updated successfully');
      } catch (e) {
        toast.error(e.message);
      } finally {
        window.location.reload();
        setIsEditing(false);
      }
    },
    [mutate]
  );

  const auth = useCurrentUser();

  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);
  const shortenedWords = post.content.slice(0, 100);

  const isCreator = auth?.data?.user
    ? post.creatorId === auth.data.user._id
    : false;

  useEffect(() => {
    if (recipeNameRef.current) recipeNameRef.current.value = post.recipeName;
    if (contentRef.current) contentRef.current.value = post.content;
    if (categoryRef.current) categoryRef.current.value = post.category;
  }, [isEditing]);

  return (
    <div className={clsx(styles.root, className)} key={post._id}>
      {isEditing ? (
        <form onSubmit={onSave}>
          <Input ref={recipeNameRef} label={'Recipe Name'} />
          <Spacer size={0.5} axis="vertical" />
          <Textarea ref={contentRef} label={'Content'} />
          <Spacer size={0.5} axis="vertical" />
          <Select
            ref={categoryRef}
            label={'Category'}
            options={[
              { label: 'meat', value: 'meat' },
              { label: 'vegetarian', value: 'vegetarian' },
              { label: 'soup', value: 'soup' },
              { label: 'dessert', value: 'dessert' },
            ]}
          ></Select>
          <Spacer size={0.5} axis="vertical" />
          <span className={styles.label}>Your Recipe Picture</span>
          <div className={styles.recipeImg}>
            <RecipeImg size={96} url={recipeImgHref} />
            <input
              aria-label="Your Recipe Picture"
              type="file"
              accept="image/*"
              ref={recipePictureRef}
              onChange={onRecipeImgChange}
            />
          </div>
          <Spacer size={1} axis="vertical" />

          {/* Add other input fields */}
          <div className={styles.buttonGroup}>
            <Button htmlType="submit" type="success">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <>
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
                  <Spacer size={0.2} axis="vertical" />
                </Container>
              </Container>
            </a>
          </Link>

          <div className={styles.wrap}>
            <time
              dateTime={String(post.createdAt)}
              className={styles.timestamp}
            >
              {timestampTxt}
            </time>
          </div>
          <Spacer size={0.5} axis="vertical" />

          {isCreator && (
            <div className={styles.buttonGroup}>
              <Button type="success" onClick={() => setIsEditing(true)}>
                Modify
              </Button>
              <Button onClick={() => deletePost(post._id)}>Delete</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Post;
