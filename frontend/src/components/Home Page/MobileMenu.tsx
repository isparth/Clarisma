import { Button } from "../ui/button";

const MobileMenu: React.FC<{ navigate: (path: string) => void }> = ({
  navigate,
}) => (
  <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-40 shadow-lg">
    <nav className="flex flex-col p-4">
      {["Features", "How It Works", "About"].map((item) => (
        <Button
          key={item}
          variant="ghost"
          className="text-[#171B42] hover:text-blue-700 py-2"
        >
          {item}
        </Button>
      ))}
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700 mt-2"
        onClick={() => navigate("/register")}
      >
        Get Started
      </Button>
    </nav>
  </div>
);

export default MobileMenu;
