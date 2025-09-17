# Typography 主題架構說明

本專案是部落格佈景主題（Typography），主要透過 `index.js` 匯出多種佈局組件，方便在 Next.js / Notion-Blog 專案中依照情境載入。下方整理目前的檔案架構與各模組職責，以及常見的使用方式。

## 專案結構

```
.
├── components/           # 主題客製化的視覺組件（TopBar、Footer、BlogPostBar…）
├── config.js             # 主題對外設定（標題、選單顯示開關…）
├── index.js              # 封裝後的佈局出口，對外統一匯出
├── layouts/              # 各種頁面佈局拆分檔案
│   ├── ArchiveLayout.jsx       # 文章歸檔頁
│   ├── BaseLayout.jsx          # 共同外殼（搜尋、導覽、跳頂按鈕…）
│   ├── ListLayouts.jsx         # 首頁、文章列表、搜尋列表
│   ├── NotFoundLayout.jsx      # 404 頁面
│   ├── SlugLayout.jsx          # 單篇文章頁
│   └── TaxonomyLayouts.jsx     # 分類與標籤頁
├── style.js              # 只針對此主題作用的全域樣式
└── utils/
    └── groupArticlesByYear.js  # 文章依年份分組的小工具
```

## 主要佈局與職責

- `LayoutBase`：最外層骨架，負責載入樣式、導覽列、頁尾、搜尋與 Loading 狀態，其他頁面內容會以 children 注入。
- `LayoutIndex` / `LayoutPostList`：顯示文章列表或首頁，會掛上 `BlogPostBar` 與 `BlogListPage`。
- `LayoutSearch`：在文章列表基礎上，透過 `replaceSearchResult` 將關鍵字高亮。
- `LayoutArchive`：使用 `groupArticlesByYearArray` 將文章依年份分組後渲染。
- `LayoutSlug`：單篇文章頁面，負責文章資訊、廣告、前後文推薦與留言區。
- `LayoutCategoryIndex` / `LayoutTagIndex`：顯示分類與標籤的索引列表。
- `Layout404`：等待 Notion 內容載入後做導向，或直接顯示 404。

## 使用說明

1. **在 Next.js 主題系統中載入**
   ```jsx
   import { LayoutBase, LayoutIndex } from 'mhhung'

   const Home = props => (
     <LayoutBase {...props}>
       <LayoutIndex {...props} />
     </LayoutBase>
   )

   export default Home
   ```
   - `LayoutBase` 會處理共同外殼；`LayoutIndex` 則是此頁的實際內容。
   - 其他頁面可依需求替換為 `LayoutArchive`、`LayoutSlug`…等對應佈局。

2. **設定主題參數**
   - 編輯 `config.js`，可調整部落格名稱、是否展示分類／標籤／歸檔選單，以及文章推薦、封面等開關。
   - 也可以透過環境變數（如 `NEXT_PUBLIC_TYPOGRAPHY_BLOG_NAME`）覆寫預設值，方便在不同部署環境中使用。

3. **擴充樣式或功能**
   - 共用樣式可以在 `style.js` 中調整或新增。
   - 若要新增新的頁面佈局，建議在 `layouts/` 下建立新的 JSX 檔案，並於 `index.js` 匯出，以維持統一入口。
   - 共用的邏輯或工具函式，可集中在 `utils/` 目錄內，減少重複程式碼。

4. **整合既有元件**
   - 所有 `layouts/` 中引用的元件皆放於 `components/`。若要替換視覺元素，如導覽列或頁尾，直接在對應元件修改即可。
   - 動態載入 (`next/dynamic`) 會避免在 SSR 階段載入僅限瀏覽器的套件，若新增依賴，請依照既有範例設定 `ssr: false`。

## 開發建議

- 調整佈局時，先確認是否為共用邏輯（放在 `BaseLayout` 或工具函式），再決定是否要拆分。
- 新增功能建議寫在對應的 `layouts/` 或 `components/` 中，並保持檔案職責單一，讓後續維護更容易。
- 若有多語系或 Theme 變化需求，可以在 `config.js` 中增加新的設定值，並於各佈局透過 `siteConfig` 取得。

有任何額外需求都可以在 README 中持續補充，讓後續維護人員快速上手。
