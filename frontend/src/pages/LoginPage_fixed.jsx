import AdminLogin from "@/components/admin/AdminLogin_compact";
import StudentLogin from "@/components/student/StudentLogin_compact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/";
import { Shield, User, Vote, Lock, Users, CheckCircle } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left Side - Responsive Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-white relative order-2 lg:order-1">
        {/* Background Pattern - Responsive */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-2 sm:top-10 sm:left-5 w-8 h-8 sm:w-16 sm:h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-5 right-2 sm:bottom-10 sm:right-5 w-6 h-6 sm:w-12 sm:h-12 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-5 sm:left-10 w-4 h-4 sm:w-8 sm:h-8 border border-white rounded-full"></div>
        </div>

        <div className="max-w-xs sm:max-w-sm lg:max-w-md mx-auto text-center relative z-10">
          {/* Logo/Brand Section - Responsive */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="mx-auto mb-2 sm:mb-3 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Vote className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              VoteSecure
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base">
              Department Election System
            </p>
          </div>

          {/* Feature Highlights - Responsive */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded flex items-center justify-center">
                <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">Secure Voting</h3>
                <p className="text-slate-300 text-xs">Encrypted ballots</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500/20 rounded flex items-center justify-center">
                <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">Real-time Results</h3>
                <p className="text-slate-300 text-xs">Instant updates</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500/20 rounded flex items-center justify-center">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">Easy Access</h3>
                <p className="text-slate-300 text-xs">Simple login</p>
              </div>
            </div>
          </div>

          {/* Statistics - Responsive */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
            <div className="text-center p-2 sm:p-3 bg-white/5 rounded">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-blue-400">100%</div>
              <div className="text-slate-300 text-xs">Secure</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white/5 rounded">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-green-400">24/7</div>
              <div className="text-slate-300 text-xs">Available</div>
            </div>
          </div>

          {/* Call to Action - Responsive */}
          <div className="text-center">
            <p className="text-slate-400 text-xs sm:text-sm lg:text-base">Ready to vote?</p>
          </div>
        </div>
      </div>

      {/* Right Side - Responsive Login Forms */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center p-3 sm:p-4 lg:p-6 order-1 lg:order-2">
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
          {/* Header - Responsive */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
              Sign in to access the election system
            </p>
          </div>

          {/* Login Tabs - Responsive */}
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 lg:h-14 mb-4 sm:mb-6 lg:mb-8 bg-white shadow-sm border">
              <TabsTrigger
                value="student"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base data-[state=active]:bg-slate-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-0">
              <StudentLogin />
            </TabsContent>

            <TabsContent value="admin" className="mt-0">
              <AdminLogin />
            </TabsContent>
          </Tabs>

          {/* Footer - Responsive */}
          <div className="text-center mt-3 sm:mt-4 lg:mt-6 text-xs sm:text-sm text-gray-500">
            <p>Secure • Transparent • Democratic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
