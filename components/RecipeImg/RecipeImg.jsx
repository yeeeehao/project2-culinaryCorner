import styles from './RecipeImg.module.css';

const RecipeImg = ({ size, username, url }) => {
  return (
    <img
      className={styles.recipeImg}
      src={url || '/images/default-recipe.png'}
      alt={username}
      width={size}
      height={size}
    />
  );
};

export default RecipeImg;
