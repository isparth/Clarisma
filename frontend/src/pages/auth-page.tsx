// MainComponent.tsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AuthTabs from "../components/Auth Page/AuthTabs";
import Statistics from "../components/Auth Page/Statistics";

const AuthPage = () => {
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location
  const [defaultTab, setDefaultTab] = useState<"register" | "login">("login");

  useEffect(() => {
    if (location.pathname === "/register") {
      setDefaultTab("register");
    } else if (location.pathname === "/login") {
      setDefaultTab("login");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray -50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2">
          <div className="p-6 bg-white md:col-span-1 col-span-2">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Clarisma
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enhance your interview skills with AI
              </CardDescription>
            </CardHeader>
            <AuthTabs defaultTab={defaultTab} />
          </div>
          <Statistics />
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
