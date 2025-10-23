import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";


const RootLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FFFAF0] flex-col">
      <NavigationBar />
        <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
