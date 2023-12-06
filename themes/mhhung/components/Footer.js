import SocialButton from './SocialButton'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className="relative z-10 flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm">
      {/* 颜色过度区 */}
      <div
        id="color-transition"
        className="h-32 bg-gradient-to-b from-[#f7f9fe] to-white  dark:bg-[#1a191d] dark:from-inherit dark:to-inherit"
      ></div>

      {/* 社交按钮 */}
      <div className="w-full h-24">
        <SocialButton />
      </div>

      <br />

      {/* 底部页面信息 */}
      <div
        id="footer"
        className="w-full h-20 flex flex-col p-3 lg:flex-row justify-center px-6 items-center bg-[#f1f3f7] dark:bg-[#30343f]"
      >
        <div id="footer-bottom-mid">
          NotionNext {siteConfig('VERSION')}{' '}
          <i className="fa-regular fa-copyright" /> {`${copyrightDate}`}{' '}
          <i className="mx-1 fa-regular fa-laptop-code" />{' '}
          <a
            href={siteConfig('LINK')}
            className="underline font-bold  dark:text-gray-300 "
          >
            {siteConfig('AUTHOR')}
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
