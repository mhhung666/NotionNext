import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'

const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (post) {
      return
    }

    const timer = setTimeout(() => {
      if (!isBrowser) {
        return
      }
      const article = document.querySelector('#article-wrapper #notion-article')
      if (!article) {
        router.push('/404').then(() => {
          console.warn('找不到頁面', router.asPath)
        })
      }
    }, waiting404)

    return () => clearTimeout(timer)
  }, [post, router, waiting404])

  return <>404 Not found.</>
}

export { Layout404 }
