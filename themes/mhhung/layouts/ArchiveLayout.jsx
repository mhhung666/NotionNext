import dynamic from 'next/dynamic'
import { groupArticlesByYearArray } from '../utils/groupArticlesByYear'

const BlogArchiveItem = dynamic(() => import('../components/BlogArchiveItem'), {
  ssr: false
})

const LayoutArchive = props => {
  const { posts } = props
  const sortPosts = groupArticlesByYearArray(posts)

  return (
    <div className='mb-10 pb-20 md:pb-12 p-5  min-h-screen w-full'>
      {sortPosts.map(p => (
        <BlogArchiveItem
          key={p.year}
          archiveTitle={p.year}
          archivePosts={p.posts}
        />
      ))}
    </div>
  )
}

export { LayoutArchive }
