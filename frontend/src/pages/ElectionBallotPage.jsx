import ElectionBallot from "@/components/ElectionBallot";
import { API } from "@/components/utils/api";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { toast } from "sonner";

export function ElectionBallotPage() {
  const [ElectionData, setElectionData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBallot();
    const interval = setInterval(fetchBallot, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBallot = async () => {
    try {
      const { data } = await axios.get(`${API}/student/ballot`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // console.log("BALLOT DATA", data);
      setElectionData(data);
    } catch (error) {
      console.log("ERROR FETCHING BALLOT", error);
      if (error.response) {
        toast.error(error?.response?.data?.detail || "Internal Server Error");
      }
    }
  };

  //   ElectionData.positions.map((pos) => console.log("Position", pos))
  //   ElectionData.positions.map((pos) =>  pos.candidates.map((cand) => console.log("Candidates", cand)))

  const handleSubmit = async (payload) => {
    try {
      // backend expects { selections: [...] }
      const { data } = await axios.post(
        `${API}/student/vote`,
        { selections: payload.votes },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(data.message || "Vote submitted successfully");
     window.location.href("/")
      fetchBallot();
    } catch (error) {
      console.log("ERROR SUBMITTING VOTE", error);
      if (error.response) {
        toast.error(error?.response?.data?.detail || "Failed to submit vote");
      }
    }
  };

  return (
    <div className="mt-8">
      <Link to="/" className="flex items-center ml-24 gap-2 mb-4">
        <ArrowLeft className="h-4 w-4 text-gray-600" />
        <div className="text-gray-600 text-sm font-medium">Back to Dashboard</div>
      </Link>
     {ElectionData ?
      <ElectionBallot
        election={ElectionData?.election}
        positions={ElectionData?.positions}
        onSubmit={handleSubmit}
      /> : 
       <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-gray-800 animate-spin" />
        <p className="text-center text-muted-foreground">Loading ballot…</p>
       </div>
      }
    </div>
  );
}
