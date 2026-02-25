import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/layouts'
import {
  DashboardPage,
  CategoriesListPage,
  CategoryFormPage,
  BrandsListPage,
  BrandFormPage,
  ProductsListPage,
  ProductFormPage,
  CollectionsListPage,
  CollectionFormPage,
  ContentArticlesListPage,
  ContentArticleFormPage,
} from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          
          {/* Categories */}
          <Route path="categories" element={<CategoriesListPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          
          {/* Brands */}
          <Route path="brands" element={<BrandsListPage />} />
          <Route path="brands/new" element={<BrandFormPage />} />
          <Route path="brands/:id/edit" element={<BrandFormPage />} />
          
          {/* Products */}
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          
          {/* Collections */}
          <Route path="collections" element={<CollectionsListPage />} />
          <Route path="collections/new" element={<CollectionFormPage />} />
          <Route path="collections/:id/edit" element={<CollectionFormPage />} />

          {/* Content Articles */}
          <Route path="content-articles" element={<ContentArticlesListPage />} />
          <Route path="content-articles/new" element={<ContentArticleFormPage />} />
          <Route path="content-articles/:id/edit" element={<ContentArticleFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
