import React from 'react';
import styles from "./header.module.css";
import Container from './container';
import Navigation from './navigation';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <header className={styles.wrapper}>
    <Container align="center" justify="space-between">
      <h1 className={styles.title}>
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
      <Navigation></Navigation>
    </Container>
  </header>
)

export default Header
