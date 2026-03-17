import AppRoutes from "./routes/appRoutes";
import AuthRoutes from "./routes/authRoutes";
import { BrowserRouter } from "react-router";
import './App.css'
import { useAuthStore } from "./store/auth/authStore";
import { useEffect } from "react";
import { authChannel } from "./utils/constants";

function App() {

  const { isAuthenticated } = useAuthStore();

  // responsible to listen broadcasting login and logout events to make multiple tabs sync if open.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      const { setLogin, setLogout } = useAuthStore.getState();

      if (type === "LOGIN") {
        setLogin(payload.user, payload.accessToken, payload?.refreshToken, true);
      }

      if (type === "LOGOUT") {
        setLogout(true);
        window.location.href = "/login";
      }
    };

    authChannel.addEventListener("message", handleMessage);

    return () => {
      authChannel.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}

export default App
