import { Typography } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext"

export const CheckoutPage = () => {

    const { cart } = useStoreContext();

    return (
        <Typography variant="h3">
            must be logged in
        </Typography>
    )
}
