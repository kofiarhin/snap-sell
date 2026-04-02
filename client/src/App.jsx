import { useAuth } from "./hooks/queries/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingSpinner from "./components/LoadingSpinner";
import { useSelector } from "react-redux";

const App = () => {
  useAuth();

  const { isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <LoadingSpinner />;

  return <AppRoutes />;
};

export default App;
