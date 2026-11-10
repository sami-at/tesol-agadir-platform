import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Program from "./pages/Program/Program";
import Practicum from "./pages/Practicum/Practicum";
import TuitionDates from "./pages/TuitionDates/TuitionDates";
import Apply from "./pages/Apply/Apply";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminSectionPage from "./admin/pages/AdminSectionPage";
import AdminApplications from "./admin/pages/AdminApplications";
import RequireAuth from "./admin/components/RequireAuth";
import { useContent } from "./context/ContentContext";
import LoadingState from "./components/common/LoadingState";
import ErrorState from "./components/common/ErrorState";

function App() {
  const { loading, error } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <LoadingState message="Loading site content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="program" element={<Program />} />
        <Route path="practicum" element={<Practicum />} />
        <Route path="tuition-dates" element={<TuitionDates />} />
        <Route path="apply" element={<Apply />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />
      <Route
        path="admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path=":sectionKey" element={<AdminSectionPage />} />
      </Route>
    </Routes>
  );
}

export default App;
