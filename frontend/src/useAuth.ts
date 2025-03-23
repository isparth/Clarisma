// useAuth.ts
import { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  email: string;
  name: string;
  picture: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/protected", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setUser(response.data.user);
        }
      })
      .catch((err) => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
};