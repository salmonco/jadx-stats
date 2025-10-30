// /contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import commonApi from "~/services/apis/commonApi";

type User = { name: string; auth: string }; // auth = "수급관리센터" 등

type AuthContextValue = {
  user: User | null;
  auth: string | null; // 토큰 대신 auth 문자열로 상태 판단
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// 임시 토큰 설정
const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN ?? null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 복구
  useEffect(() => {
    const savedAuth = localStorage.getItem("mock_auth");
    const savedUser = localStorage.getItem("mock_user");
    const savedToken = localStorage.getItem("mock_token");

    if (savedAuth) setAuth(savedAuth);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) {
      setToken(savedToken);
    } else if (DEV_TOKEN) {
      setToken(DEV_TOKEN);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // 서버 목업 로그인 호출 -> { auth: "수급관리센터" }
    const res = await commonApi.mockLogin(username, password);
    const authValue = res?.auth;

    if (!authValue || typeof authValue !== "string") {
      throw new Error("서버 응답에 auth 값이 없습니다.");
    }

    const userObj: User = { name: username, auth: authValue };

    setAuth(authValue);
    setUser(userObj);

    localStorage.setItem("mock_auth", authValue);
    localStorage.setItem("mock_user", JSON.stringify(userObj));

    const newToken = res?.token ?? DEV_TOKEN ?? token ?? null;
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("mock_token", newToken);
    }
  };

  const logout = () => {
    setAuth(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem("mock_auth");
    localStorage.removeItem("mock_user");
    localStorage.removeItem("mock_token");
  };

  const value = useMemo(() => ({ user, auth, token, isLoading, login, logout }), [user, auth, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
