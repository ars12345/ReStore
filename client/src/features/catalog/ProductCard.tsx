import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product"
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";

interface Props {
    product: Product;
}

export const ProductCard = ({ product }: Props) => {

    const [loading, setLoading] = useState(false);
    const { setCart } = useStoreContext();

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Cart.addItem(productId)
            .then(cart => setCart(cart))
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }

    return (
        <Card>
            <CardHeader
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name} />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" color='secondary'>
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={loading} onClick={() => handleAddItem(product.id)} size="small">Add to cart</LoadingButton>
                <Button size="small" component={Link} to={`/catalog/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}
