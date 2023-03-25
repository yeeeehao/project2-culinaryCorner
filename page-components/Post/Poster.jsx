import { Button } from '@/components/Button';
import { RecipeImg } from '@/components/RecipeImg';
import { Input, Textarea } from '@/components/Input';
import { Wrapper, Spacer } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { Select } from '@/components/Select';
import { usePostPages } from '@/lib/post';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Poster.module.css';

const PosterInner = ({ user }) => {
  const recipeNameRef = useRef();
  const contentRef = useRef();
  const categoryRef = useRef();
  const recipePictureRef = useRef();

  const [recipeImgHref, setRecipeImgHref] = useState();
  const onRecipeImgChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setRecipeImgHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = usePostPages();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);

        if (recipePictureRef.current.files[0]) {
          const formData = new FormData();
          formData.append('recipeName', recipeNameRef.current.value);
          formData.append('content', contentRef.current.value);
          formData.append('category', categoryRef.current.value);
          formData.append('recipePicture', recipePictureRef.current.files[0]);

          await fetch('/api/posts', {
            method: 'POST',
            body: formData,
          });

          toast.success('You have posted successfully');
          recipeNameRef.current.value = '';
          contentRef.current.value = '';
          categoryRef.current.value = '';
          recipePictureRef.current.value = '';
          setRecipeImgHref(null);

          // refresh post lists
          mutate();
          window.location.href = '/recipe';
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Post your recipe</h4>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <Input
          ref={recipeNameRef}
          className={styles.input}
          placeholder={'Your recipe name'}
          label={'Recipe Name'}
        />
        <Spacer size={1} axis="vertical" />
        <Textarea
          ref={contentRef}
          className={styles.input}
          placeholder={
            'The specific method of the recipe (at least greater than 20 letters)'
          }
          label={'Content'}
        />
        <Spacer size={1} axis="vertical" />
        <Select
          ref={categoryRef}
          className={styles.input}
          label={'Category'}
          options={[
            { label: 'meat', value: 'meat' },
            { label: 'vegetarian', value: 'vegetarian' },
            { label: 'soup', value: 'soup' },
            { label: 'dessert', value: 'dessert' },
          ]}
        ></Select>
        <Spacer size={1} axis="vertical" />
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
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Post
        </Button>
        <Spacer size={1} axis="vertical" />
      </form>
    </section>
  );
};

const Poster = () => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <Wrapper>
      <div className={styles.root}>
        <h3 className={styles.heading}>Share your thoughts</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <PosterInner user={data.user} />
        ) : (
          <Text color="secondary">
            Please{' '}
            <Link href="/login" passHref>
              <TextLink color="link" variant="highlight">
                sign in
              </TextLink>
            </Link>{' '}
            to post
          </Text>
        )}
      </div>
    </Wrapper>
  );
};

export default Poster;
