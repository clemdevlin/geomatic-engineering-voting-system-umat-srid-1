import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Shield } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { redirect } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = 'http://localhost:5000/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/admin/login`, {
        username,
        password
      });

      login(response.data.access_token, response.data.user_type, response.data.user_id);
      toast.success('Admin login successful!');
      redirect('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
          <Shield className="h-5 w-5 text-slate-600" />
        </div>
        <CardTitle className="text-lg font-bold text-gray-900">Admin Login</CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Access dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="h-9 text-sm"
            />
          </div>
          <Button onClick={handleLogin} disabled={loading} className={`w-full h-9 bg-gradient-to-b from-slate-600 to-slate-700 hover:bg-gradient-to-b hover:from-slate-700 hover:to-slate-600 transition-colors duration-300 text-sm ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
