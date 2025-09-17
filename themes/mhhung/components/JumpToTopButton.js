import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 跳轉到網頁頂部
 * 當螢幕下滑 500 像素後會出現該控制項
 * @param targetRef 關聯高度的目標 HTML 標籤
 * @param showPercent 是否顯示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const scrollListener = () => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 200
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return <div title={locale.POST.TOP}
        className={(show ? ' opacity-100 ' : 'invisible  opacity-0') + ' transition-all duration-300 flex items-center justify-center cursor-pointer bg-black h-10 w-10 bg-opacity-40 rounded-sm'}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    ><i className='fas fa-angle-up text-white ' />
    </div>
}

export default JumpToTopButton
