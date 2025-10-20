import { Vote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import { API } from "../utils/api";

const StudentLogin = () => {
  const [indexNumber, setIndexNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/student/login`, {
        index_number: indexNumber,
        pin: pin
      });

      login(response.data.access_token, response.data.user_type, response.data.user_id);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Vote className="h-5 w-5 text-blue-600" />
        </div>
        <CardTitle className="text-lg font-bold text-gray-900">Student Login</CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Enter your credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Index Number</label>
            <Input
              type="text"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
              placeholder="Enter index number"
              required
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">PIN</label>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              required
              className="h-9 text-sm"
            />
            <p className="text-xs text-gray-500">
              PIN: Surname + last 4 digits
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:bg-gradient-to-b hover:from-emerald-700 hover:to-emerald-600 transition-colors duration-300 text-sm">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentLogin;
