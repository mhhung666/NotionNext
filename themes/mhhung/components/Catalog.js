import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 目錄導覽元件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  // 目錄自動滾動
  const tRef = useRef(null)
  // 同步選中目錄事件
  const [activeSection, setActiveSection] = useState(null)

  // 監聽滾動事件
  useEffect(() => {
    // 如果沒有文章或目錄，不執行任何操作
    if (!post || !post?.toc || post?.toc?.length < 1) {
      return
    }
    
    const throttleMs = 100 // 降低節流時間提高響應速度
    
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      if (!sections || sections.length === 0) return
      
      let prevBBox = null
      let currentSectionId = null
      
      // 先檢查當前視窗中的所有標題
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        
        const bbox = section.getBoundingClientRect()
        const offset = 100 // 固定位移量，避免計算不穩定
        
        // 如果標題在視窗上方或接近頂部，認為是當前標題
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
        } else {
          // 找到第一個在視窗下方的標題就停止
          break
        }
      }
      
      // 如果沒找到任何標題在視窗上方，使用第一個標題
      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].getAttribute('data-id')
      }
      
      // 只有當 ID 變化時才更新狀態，減少不必要的渲染
      if (currentSectionId !== activeSection) {
        setActiveSection(currentSectionId)
        
        // 查找目錄中對應的索引並滾動
        const index = post?.toc?.findIndex(
          obj => uuidToId(obj.id) === currentSectionId
        )
        
        if (index !== -1 && tRef?.current) {
          tRef.current.scrollTo({ top: 28 * index, behavior: 'smooth' })
        }
      }
    }, throttleMs)
    
    const content = document.querySelector('#container-inner')
    if (!content) return // 防止 content 不存在
    
    // 添加滾動和內容變化的監聽
    content.addEventListener('scroll', actionSectionScrollSpy)
    
    // 初始執行一次
    setTimeout(() => {
      actionSectionScrollSpy()
    }, 300) // 延遲執行確保 DOM 已完全載入
    
    return () => {
      content?.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [post])

  // 無目錄就直接返回空
  if (!post || !post?.toc || post?.toc?.length < 1) {
    return <></>
  }

  return (
    <div className='px-3 '>
      <div className='dark:text-white mb-2'>
        <i className='mr-1 fas fa-stream' />
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>

      <div
        className='overflow-y-auto overscroll-none max-h-36 lg:max-h-96 scroll-hidden'
        ref={tRef}>
        <nav className='h-full text-black group'>
          {post?.toc?.map(tocItem => {
            const id = uuidToId(tocItem.id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`${activeSection === id 
                  ? 'dark:border-white border-red-700 text-red-700 font-bold' 
                  : 'text-[var(--primary-color)] dark:text-gray-500 filter blur-[1px] opacity-50 group-hover:filter-none group-hover:blur-0 group-hover:opacity-100'} 
                  hover:font-semibold hover:text-red-600 hover:filter-none hover:blur-0 hover:opacity-100
                  border-l pl-4 block border-lduration-300 transform 
                  dark:hover:text-red-400 dark:border-gray-600
                  notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item 
                  transition-all duration-300 ease-in-out`}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: tocItem.indentLevel * 16
                  }}
                  className={`truncate ${activeSection === id ? 'font-bold text-red-600 dark:text-white underline' : ''}`}>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
