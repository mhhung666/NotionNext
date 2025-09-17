import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'
import Catalog from './components/Catalog'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 主題元件

const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: false
})
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})

// 主題全域狀態
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

/**
 * 基礎版面
 *
 * @param {*} props
 * @returns
 */
const LayoutBase = props => {
  const { children } = props
  const { onLoading, fullWidth } = useGlobal()
  // const onLoading = true
  const searchModal = useRef(null)

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-typography'
        className={`${siteConfig('FONT_STYLE')} font-typography h-screen flex flex-col dark:text-gray-300 bg-white dark:bg-[#232222] overflow-hidden`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}

        <div className='flex flex-1 mx-auto overflow-hidden py-8 md:p-0 md:max-w-7xl md:px-24 w-screen'>
          {/* 主體 - 使用 flex 版面 */}
          {/* 僅文章詳情顯示 */}
          {/* {props.post && (
            <div className='mt-20 hidden md:block md:fixed md:left-5 md:w-[300px]'>
              <Catalog {...props} />
            </div>
          )} */}
          <div className='overflow-hidden md:mt-20 flex-1 '>
            {/* 左側內容區域 - 可滾動 */}
            <div
              id='container-inner'
              className='h-full w-full md:px-24 overflow-y-auto scroll-hidden relative'>
              {/* 行動版導覽 - 顯示在頂部 */}
              <div className='md:hidden'>
                <NavBar {...props} />
              </div>
              {onLoading ? (
                // 讀取時顯示 spinner
                <div className='flex items-center justify-center min-h-[500px] w-full'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white'></div>
                </div>
              ) : (
                <>{children}</>
              )}
              <AdSlot type='native' />
              {/* 行動版頁尾 - 顯示在底部 */}
              <div className='md:hidden  z-30  '>
                <Footer {...props} />
              </div>
            </div>
          </div>

          {/* 右側導覽與頁尾 - 固定不滾動 */}
          <div className='hidden md:flex md:flex-col md:flex-shrink-0 md:h-[100vh] sticky top-20'>
            <NavBar {...props} />
            <Footer {...props} />
          </div>
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        {/* 搜尋框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

/**
 * 部落格首頁
 * 首頁就是列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}
/**
 * 部落格列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
    <>
      <BlogPostBar {...props} />
      <BlogListPage {...props} />
    </>
  )
}

/**
 * 搜尋頁
 * 也是部落格列表
 * @param {*} props
 * @returns
 */
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
  }, [])

  return <LayoutPostList {...props} />
}

 function groupArticlesByYearArray(articles) {
  const grouped = {};

  for (const article of articles) {
    const year = new Date(article.publishDate).getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(article);
  }

  for (const year in grouped) {
    grouped[year].sort((a, b) => b.publishDate - a.publishDate);
  }

  // 轉成陣列並按年份倒序
  return Object.entries(grouped)
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }));
}



/**
 * 歸檔頁
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { posts } = props
  const sortPosts = groupArticlesByYearArray(posts)
  return (
    <>
      <div className='mb-10 pb-20 md:pb-12 p-5  min-h-screen w-full'>
        {sortPosts.map(p => (
          <BlogArchiveItem
            key={p.year}
            archiveTitle={p.year}
            archivePosts={p.posts}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 文章詳情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div
          className={`px-5 pt-3 ${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
          {/* 文章資訊 */}
          <ArticleInfo post={post} />

          {/* 廣告嵌入 */}
          {/* <AdSlot type={'in-article'} /> */}
          <WWAds orientation='horizontal' className='w-full' />

          <div id='article-wrapper'>
            {/* Notion 文章主體 */}
            {!lock && <NotionPage post={post} />}
          </div>

          {/* 分享 */}
          {/* <ShareBar post={post} /> */}

          {/* 廣告嵌入 */}
          <AdSlot type={'in-article'} />

          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}

          {/* 留言區 */}
          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector(
            '#article-wrapper #notion-article'
          )
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到頁面', router.asPath)
            })
          }
        }
      }, waiting404)
    }
  }, [post])
  return <>404 Not found.</>
}

/**
 * 分類列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <>
      <div id='category-list' className='px-5 duration-200 flex flex-wrap'>
        {categoryOptions?.map(category => {
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div
                className={
                  'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'
                }>
                <i className='mr-4 fas fa-folder' />
                {category.name}({category.count})
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

/**
 * 標籤列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div id='tags-list' className='px-5 duration-200 flex flex-wrap'>
        {tagOptions.map(tag => {
          return (
            <div key={tag.name} className='p-2'>
              <SmartLink
                key={tag}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200  mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
                <div className='font-light dark:text-gray-400'>
                  <i className='mr-1 fas fa-tag' />{' '}
                  {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
                </div>
              </SmartLink>
            </div>
          )
        })}
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
