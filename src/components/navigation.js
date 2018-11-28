import React from 'react'
import styles from "./navigation.module.css"
import { Link } from 'gatsby'

const ListLink = props => (
  <li className={styles.siteLink}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

const Navigation = ({ data }) => (
  <nav className={styles.wrapper}>
    <ul>
      <ListLink to="/">Home</ListLink>
      <ListLink to="/about/">About</ListLink>
    </ul>
  </nav>
)

export default Navigation
