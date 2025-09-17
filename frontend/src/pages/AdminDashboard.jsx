import StudentUpload from "@/components/student/StudentUplaod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from '@/components/ui/badge'
import { API, deleteElection } from "@/components/utils/api";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Trash2,
  Users,
  Vote,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Dashboard data:", response.data);
      setDashboardData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handledeleteElection = async () => {
   try {
     const token = user.token;
    const electionId = dashboardData.election._id;

    if (!token || !electionId) {
      toast.warning("Election Id and admin token is required for this action")
    }

    const res = await deleteElection(electionId, token);

    if (res.data?.success) {

      toast.success(res.data.message || "Election delected Successfully")
      fetchDashboard();
    }

   } catch (error) {
    console.error("Error Deleting Election", error);
    toast.error(error.response?.data?.message || "Error Deleting Election")
   }

  }

    const options = {
  weekday: 'long',   // Thursday
  year: 'numeric',   // 2025
  month: 'long',     // September
  day: 'numeric',    // 18
  hour: '2-digit',   // 12
  minute: '2-digit', // 48
  second: '2-digit', // 00
  timeZoneName: 'short' // GMT
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">
                      {dashboardData?.statistics?.total_students || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Votes Cast</p>
                    <p className="text-2xl font-bold">
                      {dashboardData?.statistics?.students_voted || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Not Voted</p>
                    <p className="text-2xl font-bold">
                      {dashboardData?.statistics?.students_not_voted || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Turnout</p>
                    <p className="text-2xl font-bold">
                      {dashboardData?.statistics?.turnout_percentage?.toFixed(
                        1
                      ) || 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Election Status */}
          {dashboardData?.election ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="h-6 w-6" />
                  Current Election: {dashboardData.election.name}
                  </div>
                  <Button variant="outline" onClick={handledeleteElection}>
                    <Trash2 className="size-8 text-destructive" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge
                      variant={
                        dashboardData.election.status === "active"
                          ? "default"
                          : dashboardData.election.status === "not_started"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {dashboardData.election.status === "active"
                        ? "Active"
                        : dashboardData.election.status === "not_started"
                        ? "Not Started"
                        : "Ended"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Time</p>
                    <p className="font-medium">
                      {new Date(
                        dashboardData.election.start_at
                      ).toLocaleString('en-US', options)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Time</p>
                    <p className="font-medium">
                      {new Date(dashboardData.election.end_at).toLocaleString('en-US', options)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">
                  No Active Election
                </CardTitle>
                <CardDescription className="mb-4">
                  Create a new election to get started
                </CardDescription>
                <a
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "mx-auto",
                  })}
                  href="/election/create"
                >
                  Create Election
                </a>
                {/* <CreateElectionModal /> */}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <StudentUpload API={API} user={user} />
                
                <Button className="h-16 flex flex-col gap-2" variant="outline">
                  <Vote className="h-6 w-6" />
                  Manage Elections
                </Button>
                <Button className="h-16 flex flex-col gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
