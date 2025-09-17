import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Shield } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-slate-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <CardDescription className="text-gray-600">
            Access the election management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="h-12"
              />
            </div>
            <Button onClick={handleLogin} disabled={loading} className={`w-full h-12 bg-slate-600 hover:bg-slate-700 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;