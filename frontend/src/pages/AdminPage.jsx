import AdminLogin from "@/components/admin/AdminLogin_compact";
import { Shield, Lock, Users, CheckCircle, Settings, BarChart3 } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="flex lg:flex-row h-screen overflow-hidden">
      {/* Left Side - Admin Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-white relative order-2 lg:order-1">
        {/* Background Pattern - Responsive */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-2 sm:top-10 sm:left-5 w-8 h-8 sm:w-16 sm:h-16 border border-white rounded-full"></div>
          <div className="absolute top-5 right-5 sm:top-10 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 border border-white rounded-full"></div>
          <div className="absolute bottom-5 right-2 sm:bottom-10 sm:right-5 w-6 h-6 sm:w-12 sm:h-12 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-5 sm:left-10 w-4 h-4 sm:w-8 sm:h-8 border border-white rounded-full"></div>
        </div>

        <div className="max-w-lg sm:max-w-xl lg:max-w-3xl mx-auto  text-center relative z-10">
          {/* Logo/Brand Section - Admin Theme */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="mx-auto mb-2 sm:mb-3 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base">
              Election Management System
            </p>
          </div>

          {/* Admin Feature Highlights */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-500/20 rounded flex items-center justify-center">
                <Settings className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">System Control</h3>
                <p className="text-slate-300 text-xs">Manage elections & settings</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500/20 rounded flex items-center justify-center">
                <BarChart3 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">Real-time Analytics</h3>
                <p className="text-slate-300 text-xs">Monitor voting progress</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/10 rounded-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500/20 rounded flex items-center justify-center">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-xs sm:text-sm">User Management</h3>
                <p className="text-slate-300 text-xs">Control access & permissions</p>
              </div>
            </div>
          </div>

          {/* Admin Statistics */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
            <div className="text-center p-2 sm:p-3 bg-white/5 rounded">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-400">Full</div>
              <div className="text-slate-300 text-xs">Control</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white/5 rounded">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-green-400">Live</div>
              <div className="text-slate-300 text-xs">Monitoring</div>
            </div>
          </div>

          {/* Admin Call to Action */}
          <div className="text-center">
            <p className="text-slate-400 text-xs sm:text-sm lg:text-base">Access admin dashboard?</p>
          </div>
        </div>
      </div>

      {/* Right Side - Admin Login Only */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col justify-center p-3 sm:p-4 lg:p-6 order-1 lg:order-2">
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
          {/* Header - Admin Theme */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
              Admin Login
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base">
              Access the election management dashboard
            </p>
          </div>

          {/* Admin Login Form Only */}
          <AdminLogin />

          {/* Footer - Admin Theme */}
          <div className="text-center mt-3 sm:mt-4 lg:mt-6 text-xs sm:text-sm text-slate-500">
            <p>Secure • Administrative • Control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
