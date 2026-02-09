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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
