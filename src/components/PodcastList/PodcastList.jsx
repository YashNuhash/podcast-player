import React from 'react'
import PodcastItem from '../PodcastItem/PodcastItem'
import styles from './PodcastList.module.scss'

export const PodcastList = ({ podcasts, title }) => (
  <div className={styles.Wrapper}>
    <h2 className={`${styles.Title} ${title && styles.SmallTitle}`}>
      {title || 'Popular Podcasts'}
    </h2>
    <div className={styles.PodcastList}>
      {podcasts.map(podcast => (
        <PodcastItem key={podcast.id} {...podcast} />
      ))}
    </div>
  </div>
)

export default React.memo(PodcastList)
