import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { NotFound } from "../../app/errors/NotFound";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addCartItemAsync, removeCartItemAsync } from "../cart/cartSlice";
import { fetchProductAsync, productSelector } from "./catalogSlice";

export const ProductDetails = () => {

  const { cart, status } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(state => productSelector.selectById(state, parseInt(id!)));
  const {status: productStatus} = useAppSelector(state => state.catalog);
  const [quantity, setQuantity] = useState(0);
  const item = cart?.items.find(i => i.productId === product?.id);

  useEffect(() => {
    if (item)
      setQuantity(item.quantity);
    if (!product) 
      dispatch(fetchProductAsync(parseInt(id!)));
  }, [id, item, dispatch, product])

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const qty = parseInt(e.currentTarget.value);
    if (qty >= 0) {
      setQuantity(qty);
    }
  }

  function handleUpdateQuantity(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (product) {
      if (!item || quantity > item.quantity) {
        const updatedQuantity = item ? quantity - item.quantity : quantity;

        dispatch(addCartItemAsync({ productId: product.id, quantity: updatedQuantity }));
      } else {
        const updatedQuantity = item.quantity - quantity;
        dispatch(removeCartItemAsync({ productId: product.id, quantity: updatedQuantity }));
      }
    }
  }

  if (productStatus.includes('pending')) return <LoadingComponent message="Loading products..." />

  if (!product) return <NotFound />

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.descritpion}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Qauntity</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label='Quantity in cart'
              fullWidth value={quantity}
              onChange={e => handleQuantityChange(e)} />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.quantity === quantity || !item && quantity === 0}
              loading={status.includes('pending')}
              sx={{ height: '55px' }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              onClick={e => handleUpdateQuantity(e)}>
              {item ? 'Update Quantity' : 'Add to Cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
