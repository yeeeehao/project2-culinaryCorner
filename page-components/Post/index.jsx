import { Spacer } from '@/components/Layout';
import styles from './Post.module.css';
import Poster from './Poster';

export const Post = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <Poster />
    </div>
  );
};
