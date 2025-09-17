import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

/**
 * 加密文章驗證元件
 * @param {password, validPassword} props
 * @param password 正確的密碼
 * @param validPassword(bool) 回呼函式，驗證成功時回傳 true
 * @returns
 */
export default function ArticleLock (props) {
  const { validPassword } = props
  const { locale } = useGlobal()

  const submitPassword = () => {
    const p = document.getElementById('password')
    if (!validPassword(p?.value)) {
      const tips = document.getElementById('tips')
      if (tips) {
        tips.innerHTML = ''
        tips.innerHTML = `<div class='text-red-500 animate__shakeX animate__animated'>${locale.COMMON.PASSWORD_ERROR}</div>`
      }
    }
  }
  const passwordInputRef = useRef(null)
  useEffect(() => {
    // 選取密碼輸入框並將它聚焦
    passwordInputRef.current.focus()
  }, [])

  return <div id='container' className='w-full flex justify-center items-center h-96 '>
        <div className='text-center space-y-3'>
            <div className='font-bold'>{locale.COMMON.ARTICLE_LOCK_TIPS}</div>
            <div className='flex mx-4'>
                <input id="password" type='password'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitPassword()
                      }
                    }}
                    ref={passwordInputRef} // 將 ref 綁定到 passwordInputRef 變數
                    className='outline-none w-full text-sm pl-5 rounded-l transition focus:shadow-lg font-light leading-10 text-black dark:bg-gray-500 bg-gray-50'
                ></input>
                <div onClick={submitPassword} className="px-3 whitespace-nowrap cursor-pointer items-center justify-center py-2 rounded-r duration-300 bg-gray-300" >
                    <i className={'duration-200 cursor-pointer fas fa-key dark:text-black'} >&nbsp;{locale.COMMON.SUBMIT}</i>
                </div>
            </div>
            <div id='tips'>
            </div>
        </div>
    </div>
}
