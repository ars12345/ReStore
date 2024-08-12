import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../utils/util";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

function App() {

  const { setCart } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Cart.get()
        .then(cart => setCart(cart))
        .catch(e => console.log(e))
        .finally(() => setLoading(false))
    } else {
      setLoading(false);
    }
  }, [setCart])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: darkMode ? "#121212" : "#eaeaea"
      }
    }
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message="Initializing app..." />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
