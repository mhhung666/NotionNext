import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import replaceSearchResult from '@/components/Mark'
import { isBrowser } from '@/lib/utils'
import BlogPostBar from '../components/BlogPostBar'

const BlogListPage = dynamic(() => import('../components/BlogListPage'), {
  ssr: false
})

const LayoutPostList = props => (
  <>
    <BlogPostBar {...props} />
    <BlogListPage {...props} />
  </>
)

const LayoutIndex = props => <LayoutPostList {...props} />

const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [keyword])

  return <LayoutPostList {...props} />
}

export { LayoutIndex, LayoutPostList, LayoutSearch }
