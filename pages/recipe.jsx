import { Recipe } from '@/page-components/Recipe';
import Head from 'next/head';

const RecipePage = () => {
  return (
    <>
      <Head>
        <title>Recipe</title>
      </Head>
      <Recipe />
    </>
  );
};

export default RecipePage;
