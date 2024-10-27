import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}> = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center relative z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl sm:text-2xl font-bold text-[#171B42]">
          Clarisma
        </span>
      </div>
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
        {["Features", "How It Works", "About"].map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="text-[#171B42] hover:text-blue-700"
          >
            {item}
          </Button>
        ))}
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </nav>
      <Button
        variant="ghost"
        className="ml-auto md:hidden"
        size="icon"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {isMobileMenuOpen && <MobileMenu navigate={navigate} />}
    </header>
  );
};

export default Header;
