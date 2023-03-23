import { Spacer } from '@/components/Layout';
import styles from './Recipe.module.css';
import Poster from './Poster';
import PostList from './PostList';

export const Recipe = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <PostList />
    </div>
  );
};
