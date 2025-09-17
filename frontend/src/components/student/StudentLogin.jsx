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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Vote className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Student Login</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your index number and PIN to access the voting system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Index Number</label>
              <Input
                type="text"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                placeholder="Enter your index number"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">PIN</label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                required
                className="h-12"
              />
              <p className="text-xs text-gray-500">
                PIN: Your surname + last 4 digits of reference number
              </p>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;