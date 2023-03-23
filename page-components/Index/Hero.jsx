import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Culinary</span>
          <span className={styles.mongodb}>Corner</span>
          <span>App</span>
        </h1>
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/recipe">
              <ButtonLink className={styles.button}>
                Enter recipe list
              </ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/yeeeehao/project2-culinaryCorner"
              type="secondary"
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          Culinary Corner aims to provide users with an easy-to-use platform for
          finding and sharing recipes.
        </p>
      </div>
    </Wrapper>
  );
};

export default Hero;
