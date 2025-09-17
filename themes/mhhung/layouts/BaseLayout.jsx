import { AdSlot } from '@/components/GoogleAdsense'
import dynamic from 'next/dynamic'
import { createContext, useContext, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { Style } from '../style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false })
const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })
const JumpToTopButton = dynamic(
  () => import('../components/JumpToTopButton'),
  {
    ssr: false
  }
)
const Footer = dynamic(() => import('../components/Footer'), { ssr: false })

const ThemeGlobalSimple = createContext()

const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

const LayoutBase = props => {
  const { children } = props
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-typography'
        className={`${siteConfig('FONT_STYLE')} font-typography h-screen flex flex-col dark:text-gray-300 bg-white dark:bg-[#232222] overflow-hidden`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}

        <div className='flex flex-1 mx-auto overflow-hidden py-8 md:p-0 md:max-w-7xl md:px-24 w-screen'>
          <div className='overflow-hidden md:mt-20 flex-1 '>
            <div
              id='container-inner'
              className='h-full w-full md:px-24 overflow-y-auto scroll-hidden relative'>
              <div className='md:hidden'>
                <NavBar {...props} />
              </div>
              {onLoading ? (
                <div className='flex items-center justify-center min-h-[500px] w-full'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white'></div>
                </div>
              ) : (
                <>{children}</>
              )}
              <AdSlot type='native' />
              <div className='md:hidden  z-30  '>
                <Footer {...props} />
              </div>
            </div>
          </div>

          <div className='hidden md:flex md:flex-col md:flex-shrink-0 md:h-[100vh] sticky top-20'>
            <NavBar {...props} />
            <Footer {...props} />
          </div>
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

export { LayoutBase, useSimpleGlobal }
