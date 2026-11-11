import { BrowserRouter } from "react-router-dom";
import UserRouter from "./routes/UserRoutes";
import { SnackbarProvider } from "notistack";

export default function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
    >
      <BrowserRouter basename="/">
        <UserRouter />
      </BrowserRouter>
    </SnackbarProvider>
  )
}