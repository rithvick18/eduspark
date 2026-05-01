import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
