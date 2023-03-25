import { Button } from '@/components/Button';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post1 } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';
import { useState, useEffect, useMemo } from 'react';

const PostList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages();

  const allPosts = useMemo(() => {
    return data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];
  }, [data]);

  const [filteredPosts, setFilteredPosts] = useState(allPosts);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(
        allPosts.filter((post) => post.category === selectedCategory)
      );
    }
  }, [allPosts, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        <div className={styles.filterBar}>
          <label htmlFor="categorySelect">Filter by category: </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All</option>
            <option value="meat">Meat</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="soup">Soup</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        <Spacer axis="vertical" size={1} />
        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            href={`/user/${post.creator.username}/post/${post._id}`}
            passHref
          >
            <div className={styles.wrap}>
              <Post1 className={styles.post} post={post} />
            </div>
          </Link>
        ))}
        <Container justifyContent="center">
          {isReachingEnd ? (
            <Text color="secondary">No more posts are found</Text>
          ) : (
            <Button
              variant="ghost"
              type="success"
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container>
      </Wrapper>
    </div>
  );
};

export default PostList;
