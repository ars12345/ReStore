import { useEffect } from "react"
import { ProductList } from "./ProductList";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelector } from "./catalogSlice";

export const Catalog = () => {

  const products = useAppSelector(productSelector.selectAll);
  const {productsLoaded, status} = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded)
      dispatch(fetchProductsAsync());
  }, [productsLoaded])

  if (status.includes('pending')) return <LoadingComponent message="Loading products..." />

  return (
    <>
      <ProductList products={products} />
    </>
  )
}
