import SmartLink from '@/components/SmartLink'

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props

  return (
    <div id='category-list' className='px-5 duration-200 flex flex-wrap'>
      {categoryOptions?.map(category => (
        <SmartLink
          key={category.name}
          href={`/category/${category.name}`}
          passHref
          legacyBehavior>
          <div className='hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'>
            <i className='mr-4 fas fa-folder' />
            {category.name}({category.count})
          </div>
        </SmartLink>
      ))}
    </div>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props

  return (
    <div id='tags-list' className='px-5 duration-200 flex flex-wrap'>
      {tagOptions.map(tag => (
        <div key={tag.name} className='p-2'>
          <SmartLink
            key={tag}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            passHref
            className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200  mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
            <div className='font-light dark:text-gray-400'>
              <i className='mr-1 fas fa-tag' /> {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
            </div>
          </SmartLink>
        </div>
      ))}
    </div>
  )
}

export { LayoutCategoryIndex, LayoutTagIndex }
