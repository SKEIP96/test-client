import { useState, useEffect } from "react";
import { apiClient } from "../libs/api/client"; // <- импортируем один клиент

export const useUser = () => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/me"); // просто путь, baseURL уже задан
        setUser(res.data);
      } catch (err) {
        setError("Не удалось загрузить пользователя");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
