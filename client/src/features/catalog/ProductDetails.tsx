import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { NotFound } from "../../app/errors/NotFound";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export const ProductDetails = () => {

  const { cart, setCart, removeItem } = useStoreContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const item = cart?.items.find(i => i.productId === product?.id);

  useEffect(() => {
    if (item)
      setQuantity(item.quantity);

    if (id) {
      agent.Catalog.details(parseInt(id))
        .then(async productDetails => setProduct(productDetails))
        .catch(e => console.log(e))
        .finally(() => setLoading(false));
    }
  }, [id, item])

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const qty = parseInt(e.currentTarget.value);
    if (qty >= 0) {
      setQuantity(qty);
    }
  }

  function handleUpdateQuantity(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (product) {
      setSubmitting(true);
      if (!item || quantity > item.quantity) {
        const updatedQuantity = item ? quantity - item.quantity : quantity;

        agent.Cart.addItem(product.id, updatedQuantity)
          .then(cart => setCart(cart))
          .catch(e => console.log(e))
          .finally(() => setSubmitting(false));
      } else {
        const updatedQuantity = item.quantity - quantity;
        agent.Cart.removeItem(product?.id, updatedQuantity)
          .then(() => removeItem(product?.id, updatedQuantity))
          .catch(e => console.log(e))
          .finally(() => setSubmitting(false));
      }
    }
  }

  if (loading) return <LoadingComponent message="Loading products..." />

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
              loading={submitting}
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
