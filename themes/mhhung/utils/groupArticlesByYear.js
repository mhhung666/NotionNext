const groupArticlesByYearArray = articles => {
  const grouped = {}

  for (const article of articles) {
    const year = new Date(article.publishDate).getFullYear().toString()
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(article)
  }

  for (const year in grouped) {
    grouped[year].sort((a, b) => b.publishDate - a.publishDate)
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }))
}

export { groupArticlesByYearArray }
