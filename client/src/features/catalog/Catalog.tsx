import { useEffect, useState } from "react"
import { Product } from "../../app/models/product";
import { ProductList } from "./ProductList";

export const Catalog = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(r => r.json())
      .then(data => setProducts(data));
  }, [])

  return (
    <>
      <ProductList products={products} />
    </>
  )
}
