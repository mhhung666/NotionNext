import { AdSlot } from '@/components/GoogleAdsense'
import NotionPage from '@/components/NotionPage'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const ArticleLock = dynamic(() => import('../components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('../components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('../components/ArticleAround'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('../components/RecommendPosts'), {
  ssr: false
})
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  if (lock) {
    return <ArticleLock validPassword={validPassword} />
  }

  if (!post) {
    return null
  }

  const isPost = post?.type === 'Post'

  return (
    <div className={`px-5 pt-3 ${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
      <ArticleInfo post={post} />
      <WWAds orientation='horizontal' className='w-full' />

      <div id='article-wrapper'>
        <NotionPage post={post} />
      </div>

      <AdSlot type={'in-article'} />

      {isPost && (
        <>
          <ArticleAround prev={prev} next={next} />
          <RecommendPosts recommendPosts={recommendPosts} />
        </>
      )}

      <Comment frontMatter={post} />
    </div>
  )
}

export { LayoutSlug }
