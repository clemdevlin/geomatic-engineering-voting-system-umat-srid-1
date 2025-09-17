import AdminLogin from "@/components/admin/AdminLogin";
import StudentLogin from "@/components/student/StudentLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Shield, User } from "lucide-react";

const LoginPage = () => {
  return (
    <Tabs defaultValue="student" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Department Election System</h1>
          <p className="text-gray-600">Secure digital voting for Level 100-400 students</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="student" className="flex items-center gap-2 data-[state=active]:font-semibold ">
              <User className="h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:font-semibold">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="student">
          <StudentLogin />
        </TabsContent>
        
        <TabsContent value="admin">
          <AdminLogin />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LoginPage;