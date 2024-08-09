import { useEffect, useState } from "react"
import { Product } from "../../app/models/product";
import { ProductList } from "./ProductList";
import axios from "axios";

export const Catalog = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(r => setProducts(r.data))
      .catch(e => console.log(e));
  }, [])

  return (
    <>
      <ProductList products={products} />
    </>
  )
}
