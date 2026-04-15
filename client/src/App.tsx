import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Category from "@/pages/Category";
import Archive from "@/pages/Archive";
import Author from "@/pages/Author";
import Authors from "@/pages/Authors";
import GuestAuthors from "@/pages/GuestAuthors";
import Contribute from "@/pages/Contribute";
import Categories from "@/pages/Categories";
import Tag from "@/pages/Tag";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/article/:slug"} component={Article} />
      <Route path={"/categories"} component={Categories} />
      <Route path={"/category/:slug"} component={Category} />
      <Route path={"/tag/:tag"} component={Tag} />
      <Route path={"/archive"} component={Archive} />
      <Route path={"/authors"} component={Authors} />
      <Route path={"/author/:id"} component={Author} />
      <Route path={"/guest-authors"} component={GuestAuthors} />
      <Route path={"/contribute"} component={Contribute} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
