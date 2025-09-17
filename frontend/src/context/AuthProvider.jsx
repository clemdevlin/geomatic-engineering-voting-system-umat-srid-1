import { API } from "@/components/utils/api";
import axios from "axios";
import { useState, createContext, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initData, setInitData] = useState(null)

   

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.sub,
            type: payload.type,
            token: token
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userType, userId) => {
    localStorage.setItem('token', token);
    setUser({ id: userId, type: userType, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };


    const fectchPrerequisites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.warning("Token is not Provided")
        }
        const { data } = await axios.get(`${API}/admin/elections/prerequisites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("INITIAL DATA", data);
        setInitData(data);
      } catch (error) {
        console.log("ERROR FETCHING PREREQUISTES", error);
        if (error.response){
        toast.error(error?.response?.data?.detail);
        }
      }
    };

  return (
    <AuthContext.Provider value={{ user, loading, initData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;