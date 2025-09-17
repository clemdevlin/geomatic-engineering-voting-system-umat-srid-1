import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API } from "@/components/utils/api";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { CalendarClock, CheckCircle, Clock, Vote, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API}/student/status`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStatus(response.data);
    } catch (error) {
      console.log("error getting status", error)
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status?.status === 'no_election') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
          
          <Card className="text-center p-8">
            <CardContent>
              <CalendarClock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Election Scheduled</CardTitle>
              <CardDescription>
                There are currently no elections scheduled. Please check back later.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const election = status?.election;
  const currentTime = new Date();
  const startTime = new Date(election?.start_at);
  const endTime = new Date(election?.end_at);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>

        <div className="grid gap-6">
          {/* Election Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-6 w-6" />
                {election?.name}
              </CardTitle>
              <CardDescription>
                Election Status: <Badge variant={
                  election?.status === 'active' ? 'default' : 
                  election?.status === 'not_started' ? 'secondary' : 'destructive'
                }>
                  {election?.status === 'active' ? 'Voting Active' :
                   election?.status === 'not_started' ? 'Not Started' : 'Ended'}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Voting Period</p>
                  <p className="font-medium text-sm">
                    {startTime.toLocaleString('en-US', options)} - {endTime.toLocaleString('en-US', options)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Status</p>
                  <div className="flex items-center gap-2">
                    {status?.has_voted ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">Vote Submitted</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600 font-medium">Not Voted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status-based Content */}
          {election?.status === 'not_started' && (
            <Card >
              <CardHeader>
                <CardTitle className="text-center">Voting Hasn't Started Yet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg mb-4">Voting will begin in:</p>
                  <CountdownTimer targetDate={election.start_at} />
                </div>
              </CardContent>
            </Card>
          )}

          {election?.status === 'active' && !status?.has_voted && (
            <Card>
              <CardHeader className="bg-slate-500 rounded-t-xl">
                <CardTitle className="text-center text-white">Cast Your Vote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg my-4">Voting ends in:</p>
                    <CountdownTimer targetDate={election.end_at} />
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/ballot'} 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Ballot
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {election?.status === 'active' && status?.has_voted && (
            <Card>
              <CardHeader>
                <CardTitle>Vote Submitted Successfully</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg mb-4">You have successfully cast your vote!</p>
                  <p className="text-gray-600 mb-4">Please wait for the results to be published.</p>
                  <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-sm text-gray-600 mb-2">Voting ends in:</p>
                    <CountdownTimer targetDate={election.end_at} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {election?.status === 'ended' && (
            <Card>
              <CardHeader>
                <CardTitle>Election Ended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  {status?.has_voted ? (
                    <>
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <p className="text-lg text-green-600 font-medium mb-2">
                        You successfully cast your vote!
                      </p>
                      <p className="text-gray-600">Thank you for participating. Results will be published soon.</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                      <p className="text-lg text-red-600 font-medium mb-2">
                        You did not cast your vote
                      </p>
                      <p className="text-gray-600">The voting period has ended.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;