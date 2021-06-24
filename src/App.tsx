import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/Routes";
import Layout from "./Layout";
import "./App.css";
import "./fontawesome";
import ModalContextProvider from "./state/modal-context";
import AuthContextProvider from "./state/auth-context";

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <Router>
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
