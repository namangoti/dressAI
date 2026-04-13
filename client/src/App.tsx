import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cartContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TryOn from "@/pages/TryOn";
import Wardrobe from "@/pages/Wardrobe";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/try-on" component={TryOn} />
      <Route path="/wardrobe" component={Wardrobe} />
      <Route path="/profile" component={Profile} />
      <Route path="/cart" component={Cart} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;