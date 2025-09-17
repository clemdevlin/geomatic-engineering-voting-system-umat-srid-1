import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  Users, 
  Vote, 
  AlertCircle,
  CheckCircle,
  Settings,
  Eye,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { Link } from 'react-router-dom';

const API = "http://localhost:5000/api"; // Replace with your actual API base URL

const CreateElectionPage = () => {
  const [step, setStep] = useState(1);
  const [electionData, setElectionData] = useState({
    name: '',
    start_at: '',
    end_at: '',
    positions: [],
    polls: []
  });
  const [currentPosition, setCurrentPosition] = useState({ name: '', candidates: [''] });
  const [currentPoll, setCurrentPoll] = useState({ question: '', order: 0 });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {user} = useAuth()

  // Mock data for demonstration
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeElection, setActiveElection] = useState(null); // null means no active election

  useEffect(() => {
    try {
      const fetchInitialData = async () => {
        const {data} = await axios.get(`${API}/admin/elections/prerequisites`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTotalStudents(data.total_students);
        setActiveElection(data.active_election)
        console.log("Prerequisite data:", data);
      }
      fetchInitialData();
    } catch (error) {
      toast.error(error?.response?.data?.deatail || "❌ Failed to fetch initial data.");
    }
  }, []);

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!electionData.name.trim()) {
        newErrors.name = 'Election name is required';
      }
      if (!electionData.start_at) {
        newErrors.start_at = 'Start date and time is required';
      }
      if (!electionData.end_at) {
        newErrors.end_at = 'End date and time is required';
      }
      if (electionData.start_at && electionData.end_at) {
        if (new Date(electionData.start_at) >= new Date(electionData.end_at)) {
          newErrors.end_at = 'End time must be after start time';
        }
        if (new Date(electionData.start_at) <= new Date()) {
          newErrors.start_at = 'Start time must be in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPosition = () => {
    if (currentPosition.name.trim() && currentPosition.candidates.filter(c => c.trim()).length >= 1) {
      const newPosition = {
        id: Date.now().toString(),
        name: currentPosition.name,
        order: electionData.positions.length,
        candidates: currentPosition.candidates.filter(c => c.trim()).map((name, index) => ({
          id: `${Date.now()}-${index}`,
          name: name.trim()
        }))
      };
      
      setElectionData(prev => ({
        ...prev,
        positions: [...prev.positions, newPosition]
      }));
      
      setCurrentPosition({ name: '', candidates: [''] });
    }
  };

  const removePosition = (positionId) => {
    setElectionData(prev => ({
      ...prev,
      positions: prev.positions.filter(p => p.id !== positionId)
    }));
  };

  const addCandidate = () => {
    setCurrentPosition(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const updateCandidate = (index, value) => {
    setCurrentPosition(prev => ({
      ...prev,
      candidates: prev.candidates.map((c, i) => i === index ? value : c)
    }));
  };

  const removeCandidate = (index) => {
    if (currentPosition.candidates.length > 1) {
      setCurrentPosition(prev => ({
        ...prev,
        candidates: prev.candidates.filter((_, i) => i !== index)
      }));
    }
  };

  const addPoll = () => {
    if (currentPoll.question.trim()) {
      const newPoll = {
        id: Date.now().toString(),
        question: currentPoll.question,
        order: electionData.polls.length
      };
      
      setElectionData(prev => ({
        ...prev,
        polls: [...prev.polls, newPoll]
      }));
      
      setCurrentPoll({ question: '', order: 0 });
    }
  };

  const removePoll = (pollId) => {
    setElectionData(prev => ({
      ...prev,
      polls: prev.polls.filter(p => p.id !== pollId)
    }));
  };

const payload = {
  ...electionData,
  positions: electionData.positions.map(p => ({
    name: p.name,
    order: p.order,
    candidates: p.candidates.map(c => c.name) // only send names
  })),
  polls: electionData.polls.map(p => ({
    question: p.question,
    order: p.order
  }))
};




const createElection = async () => {
  setLoading(true);
  console.log("Payload", payload);
  
  try {
    // Send request to your backend
    const response = await axios.post(
      `${API}/admin/elections/complete`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          // If you use authentication (JWT token for admin)
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    toast.success("✅ Election created successfully!");
    console.log("Election response:", response.data);

    // Reset form after successful creation
    setElectionData({
      name: "",
      start_at: "",
      end_at: "",
      positions: [],
      polls: [],
    });
    setStep(1);
  } catch (error) {
    console.error("Error creating election:", error);

    if (error.response) {
      toast.error(`❌ Failed: ${error.response.data.detail, '\n', error.response.data.error || "Server error"}`);
    } else {
      toast.error("❌ Network error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  if (activeElection) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There is already an active election: "{activeElection.name}". 
            You cannot create a new election until the current one ends.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Link to="/" className='flex items-center space-y-4 gap-2 text-muted-foreground text-sm'>
        <ArrowLeft  className='size-4'/> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
          <p className="text-gray-600 mt-2">Set up a new election for your department</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Users className="h-4 w-4 mr-1" />
          {totalStudents} Eligible Voters
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Basic Info
              </span>
            </div>
            
            <div className={`h-px flex-1 mx-4 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Positions & Candidates
              </span>
            </div>
            
            <div className={`h-px flex-1 mx-4 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 3 ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Polls & Review
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basic Election Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Election Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="election-name">Election Name *</Label>
              <Input
                id="election-name"
                value={electionData.name}
                onChange={(e) => setElectionData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Computer Science Department Elections 2024"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date & Time *</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={electionData.start_at}
                  onChange={(e) => setElectionData(prev => ({ ...prev, start_at: e.target.value }))}
                  className={errors.start_at ? 'border-red-500' : ''}
                />
                {errors.start_at && <p className="text-sm text-red-500">{errors.start_at}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date & Time *</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={electionData.end_at}
                  onChange={(e) => setElectionData(prev => ({ ...prev, end_at: e.target.value }))}
                  className={errors.end_at ? 'border-red-500' : ''}
                />
                {errors.end_at && <p className="text-sm text-red-500">{errors.end_at}</p>}
              </div>
            </div>

            {electionData.start_at && electionData.end_at && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Voting period: {new Date(electionData.start_at).toISOString()} - {new Date(electionData.end_at).toISOString()}
                  <br />
                  Duration: {Math.round((new Date(electionData.end_at) - new Date(electionData.start_at)) / (1000 * 60 * 60))} hours
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  if (validateStep(1)) {
                    setStep(2);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Add Positions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Positions and Candidates */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Add New Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position-name">Position Name</Label>
                <Input
                  id="position-name"
                  value={currentPosition.name}
                  onChange={(e) => setCurrentPosition(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Class Representative, Secretary, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Candidates</Label>
                {currentPosition.candidates.map((candidate, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={candidate}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                      placeholder={`Candidate ${index + 1} name`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCandidate(index)}
                      disabled={currentPosition.candidates.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCandidate}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Candidate
                </Button>
              </div>

              <Button onClick={addPosition} className="w-full">
                Add Position
              </Button>
            </CardContent>
          </Card>

          {/* Existing Positions */}
          {electionData.positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Added Positions ({electionData.positions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {electionData.positions.map((position, index) => (
                  <div key={position.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{position.name}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePosition(position.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Candidates:</p>
                      {position.candidates.map((candidate, idx) => (
                        <div key={candidate.id} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {idx + 1}
                          </Badge>
                          <span className="text-sm">{candidate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={() => setStep(3)}
              disabled={electionData.positions.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next: Add Polls
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Polls and Review */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Add Poll */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Yes/No Poll (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poll-question">Poll Question</Label>
                <Textarea
                  id="poll-question"
                  value={currentPoll.question}
                  onChange={(e) => setCurrentPoll(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="e.g., Should the department organize more social events?"
                  rows={3}
                />
              </div>
              <Button onClick={addPoll} disabled={!currentPoll.question.trim()}>
                Add Poll
              </Button>
            </CardContent>
          </Card>

          {/* Added Polls */}
          {electionData.polls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Added Polls ({electionData.polls.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {electionData.polls.map((poll) => (
                  <div key={poll.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{poll.question}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePoll(poll.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Election Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Election Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Election Name</p>
                  <p className="font-medium">{electionData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Eligible Voters</p>
                  <p className="font-medium">{totalStudents} students</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date(electionData.start_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{new Date(electionData.end_at).toLocaleString()}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Positions: {electionData.positions.length}</p>
                {electionData.positions.map((position, index) => (
                  <div key={position.id} className="ml-4">
                    <p className="text-sm">
                      {index + 1}. {position.name} ({position.candidates.length} candidates)
                    </p>
                  </div>
                ))}
              </div>

              {electionData.polls.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Polls: {electionData.polls.length}</p>
                    {electionData.polls.map((poll, index) => (
                      <div key={poll.id} className="ml-4">
                        <p className="text-sm">{index + 1}. {poll.question}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              onClick={createElection}
              disabled={loading || electionData.positions.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Election...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Election
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateElectionPage;