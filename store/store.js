import create from "zustand";

export const isServer = typeof window === "undefined";

const getDefaultValues = () => {
  let token = "";
  if (!isServer) {
    try {
      token = localStorage.getItem("@app/token") || "";
    } catch {
      token = "";
    }
  }
  const isLoggedIn = !!token;
  return {
    token,
    isLoggedIn,
    isLoading: false,
  };
};

const useStore = create((set) => ({
  ...getDefaultValues(),
  setIsLoggedIn: (value) => set((state) => ({ isLoggedIn: value })),
  setIsLoading: (value) => set((state) => ({ isLoading: value })),
  setToken: (value) =>
    set((state) => {
      localStorage.setItem("@app/token", value);
      return { token: value };
    }),
  logout: () =>
    set((state) => {
      localStorage.removeItem("@app/token");
      return { token: null, isLoggedIn: false };
    }),
}));

export default useStore;
