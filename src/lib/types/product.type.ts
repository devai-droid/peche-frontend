import { Product, ProductDetailPage } from "../orval/model"

export interface ExtendedProductDetailPage extends Omit<ProductDetailPage, "products"> {
  products: Product[]
}
