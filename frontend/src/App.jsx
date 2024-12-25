import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListingPage from "./pages/CreateListingPage";
import UpdateListingPage from "./pages/UpdateListingPage";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListingPage />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
