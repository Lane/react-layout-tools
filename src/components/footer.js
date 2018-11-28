import React from 'react'
import styles from "./footer.module.css"
import Navigation from "./navigation"

const Footer = () => (
  <footer className={styles.wrapper}>
    <div className={styles.content}>
      <Navigation className={styles.footerNav}></Navigation>
    </div>
  </footer>
)

export default Footer
