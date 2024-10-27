import React from 'react'
import { Link } from 'react-router-dom'
import EllipsisText from '../EllipsisText/EllipsisText'
import styles from './PodcastItem.module.scss'

/**
 * Renders a PodcastItem component.
 *
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID of the podcast.
 * @param {string} props.thumbnail - The URL of the podcast thumbnail.
 * @param {string} props.title - The title of the podcast.
 * @param {string} props.publisher - The publisher of the podcast.
 * @return {JSX.Element} The rendered PodcastItem component.
 */
export const PodcastItem = ({ id, thumbnail, title, publisher }) => (
  <div className={styles.Item} key={id}>
    <div className={styles.ImageWrapper}>
      <img className={styles.Image} src={thumbnail} alt='' />
    </div>
    <div className={styles.Content}>
      <EllipsisText tagName='p' className={styles.Publisher}>
        {publisher}
      </EllipsisText>
      <EllipsisText tagName='h4' className={styles.Title}>
        {title}
      </EllipsisText>

      <Link to={`/podcast/${id}`} className={styles.Button}>
        View More
      </Link>
    </div>
  </div>
)

export default PodcastItem
