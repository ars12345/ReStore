import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { CartSummary } from "./CartSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addCartItemAsync, removeCartItemAsync } from "./cartSlice";

export const CartPage = () => {

    const { cart, status } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    if (!cart) return <Typography variant="h3">Your cart is empty</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.items.map(item => (
                            <TableRow key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">${(item.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton
                                        loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
                                        color="error"
                                        onClick={() => dispatch(removeCartItemAsync({
                                            productId: item.productId,
                                            quantity: 1,
                                            name: 'rem'
                                        }))}>
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton
                                        loading={status === 'pendingAddItem' + item.productId}
                                        color="secondary"
                                        onClick={() => dispatch(addCartItemAsync({ productId: item.productId }))}>
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton
                                        loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                                        color="error"
                                        onClick={() => dispatch(removeCartItemAsync({
                                            productId: item.productId,
                                            quantity: item.quantity,
                                            name: 'del'
                                        }))}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <CartSummary />
                    <Button component={Link}
                        to='/checkout'
                        variant="contained"
                        size='large'
                        fullWidth>
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
