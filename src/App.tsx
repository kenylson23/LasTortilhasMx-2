import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/ui/toast";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Kitchen from "./pages/Kitchen";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route path="/cozinha" component={Kitchen} />
      <Route path="/rastreamento" component={OrderTracking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
