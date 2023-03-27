import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { useCurrentUser } from '@/lib/user';
import { fetcher } from '@/lib/fetch';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Poster.module.css';
import Modal from 'react-modal';

const PosterInner = ({ user }) => {
  const [bookmarksModalIsOpen, setBookmarksModalIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const openBookmarksModal = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/bookmarks`);
    const data = await response.json();
    const filteredBookmarks = data.bookmarks.filter(
      (bookmark) => bookmark.creatorId === user._id
    );

    setBookmarks(filteredBookmarks);
    setBookmarksModalIsOpen(true);
  };

  const closeBookmarksModal = () => {
    setBookmarksModalIsOpen(false);
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      await fetcher(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });
      toast.success('Bookmark has been removed successfully');

      window.location.reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Container className={styles.poster}>
        <Avatar size={40} username={user.username} url={user.profilePicture} />
        <div>&nbsp;&nbsp;</div>
        <Text> What food are you thinking about, {user.name}? </Text>
        <Button className={styles.endbutton2} onClick={openBookmarksModal}>
          Bookmarks
        </Button>
        <Link href="/post">
          <Button className={styles.endbutton}>Post</Button>
        </Link>
      </Container>
      <Modal
        isOpen={bookmarksModalIsOpen}
        onRequestClose={closeBookmarksModal}
        contentLabel="Bookmarks"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>My Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p>No bookmarks found.</p>
        ) : (
          <ul className={styles.bookmarksList}>
            {bookmarks.map((bookmark) => (
              <div className={styles.linkAndButton} key={bookmark._id}>
                <Link
                  href={`/user/${bookmark.creator.username}/post/${bookmark.recipeId}`}
                  passHref
                >
                  <a className={styles.bookmark}>{bookmark.recipeName}</a>
                </Link>
                <button onClick={() => removeBookmark(bookmark._id)}>
                  remove
                </button>
              </div>
            ))}
          </ul>
        )}
        <Spacer axis="vertical" size={1} />
        <Button onClick={closeBookmarksModal}>Close</Button>
      </Modal>
    </>
  );
};

const Poster = () => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <Wrapper>
      <div className={styles.root}>
        <h3 className={styles.heading}>Share your recipe</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <PosterInner user={data.user} />
        ) : (
          <Text color="secondary">
            Please{' '}
            <Link href="/login" passHref>
              <TextLink color="link" variant="highlight">
                log in
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
