// PostList.js

import { Button } from '@/components/Button';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { Post1 } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import Link from 'next/link';
import styles from './PostList.module.css';
import { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { RecipeImg } from '@/components/RecipeImg';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

const PostList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages();

  const allPosts = useMemo(() => {
    return data ? data.reduce((acc, val) => [...acc, ...val.posts], []) : [];
  }, [data]);

  const [filteredPosts, setFilteredPosts] = useState(allPosts);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedCategory === 'all') {
      const newFilteredPosts = allPosts.filter((post) =>
        post.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(newFilteredPosts);
    } else {
      const newFilteredPosts = allPosts.filter(
        (post) =>
          post.category === selectedCategory &&
          post.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(newFilteredPosts);
    }
  }, [allPosts, selectedCategory, searchTerm]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [randomMenu, setRandomMenu] = useState(null);

  function getRandomNumbers(n) {
    const num1 = Math.floor(Math.random() * n);
    let num2 = Math.floor(Math.random() * n);
    while (num1 === num2) {
      num2 = Math.floor(Math.random() * n);
    }
    return [num1, num2];
  }

  const openModal = () => {
    const n = allPosts.length;
    const [n1, n2] = getRandomNumbers(n);
    setRandomMenu(allPosts[n1]);
    console.log(randomMenu);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        <input
          className={styles.input}
          type="text"
          placeholder="Search by recipe name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Spacer axis="vertical" size={1} />
        <div className={styles.filterAndButtonContainer}>
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
          <Button onClick={openModal}>Random Recipe</Button>
        </div>
        <Spacer axis="vertical" size={1} />
        {filteredPosts.map((post) => (
          <div key={post._id}>
            <Post1 className={styles.post} post={post} />
            <Spacer axis="vertical" size={0.5} />
          </div>
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
      <div className={styles.randomMenu}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Random Menu"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>Random Recipe</h2>

          {randomMenu && (
            <div className={styles.Wrap}>
              <RecipeImg size={300} url={randomMenu.recipePicture} />
              <Spacer axis="vertical" size={0.5} />
              <Link
                key={randomMenu._id}
                href={`/user/${randomMenu.creator.username}/post/${randomMenu._id}`}
                passHref
              >
                <a className={styles.menuItem}>{randomMenu.recipeName}</a>
              </Link>
            </div>
          )}
          <Spacer axis="vertical" size={1} />
          <Button onClick={closeModal}>close</Button>
        </Modal>
      </div>
    </div>
  );
};

export default PostList;
