import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

export default function MultiStepElectionBallot({
  election = {},
  positions = [],
  allowWriteIn = false,
  disabled = false,
  onSubmit = () => {},
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [writeIns, setWriteIns] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const listRef = useRef(null);

  const totalSteps = positions.length;
  const currentPosition = positions[currentStep];

  const handleOptionClick = (posId, candId) => {
    if (disabled || submitting) return;
    setSelections((prev) => ({ ...prev, [posId]: candId }));
  };

  const handleYesNo = (posId, value) => {
    setSelections((prev) => ({ ...prev, [posId]: value }));
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        electionId: election._id,
        votes: positions.map((p) => ({
          positionId: p.position._id,
          selection: selections[p.position._id] || null,
          writeIn: writeIns[p.position._id] || "",
        })),
      };
      await Promise.resolve(onSubmit(payload));
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {election?.name || "Election Ballot"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Step {currentStep + 1} of {totalSteps} —{" "}
          {currentPosition?.position?.name}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={((currentStep + 1) / totalSteps) * 100} />
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-2">
          Cast your vote wisely
        </CardDescription>
        {/* Candidates */}
        <div
          ref={listRef}
          role="radiogroup"
          aria-labelledby="ballot-label"
          className="space-y-3"
        >
          {currentPosition?.candidates?.length === 1 ? (
            <div className="space-y-2">
              <p className="font-medium">
                {currentPosition.candidates[0].name}
              </p>
              <div className="flex gap-3">
                <Button
                  variant={
                    selections[currentPosition.position._id] === "yes"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleYesNo(currentPosition.position._id, "yes")
                  }
                >
                  Yes
                </Button>
                <Button
                  variant={
                    selections[currentPosition.position._id] === "no"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleYesNo(currentPosition.position._id, "no")
                  }
                >
                  No
                </Button>
              </div>
            </div>
          ) : (
            currentPosition?.candidates?.map((cand) => {
              const selected =
                selections[currentPosition.position._id] === cand._id;
              return (
                <button
                  key={cand._id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() =>
                    handleOptionClick(currentPosition.position._id, cand._id)
                  }
                  className={`w-full text-left p-3 rounded-lg border transition flex gap-3 items-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                    selected
                      ? "border-sky-500 bg-sky-50 shadow-sm"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {cand.imageUrl ? (
                   <Avatar>
                     {/* <img
                      src={cand.imageUrl}
                      alt={cand.name}
                      className="w-10 h-10 rounded-full object-cover"
                    /> */}
                    <AvatarImage src={cand.imageUrl} alt={cand.name}  className="w-20 h-20 rounded-md object-cover" />
                   </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-xs text-center text-zinc-500">
                        No Image
                      </AvatarFallback>
                    </Avatar>
                    // <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-xs text-zinc-500">
                    //   No Image
                    // </div>
                  )}

                  <div className="flex-1">
                    <div className="font-medium">{cand.name}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            Back
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button onClick={() => setCurrentStep((s) => s + 1)}>Next</Button>
          ) : (
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
              <DialogTrigger asChild>
                <Button disabled={submitting}>Review & Submit</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review your ballot</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Review your ballot, You can click on the cancel button and go
                  back and check if everything is ok for you!!!
                </DialogDescription>
                <div className="space-y-3 mt-2">
                  {positions.map((p) => (
                    <div key={p.position._id} className="rounded-md border p-3">
                      <div className="text-sm font-medium">
                        {p.position.name}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {selections[p.position._id]
                          ? p.candidates.find(
                              (c) => c._id === selections[p.position._id]
                            )?.name || selections[p.position._id]
                          : "No selection"}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={submit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Confirm & Submit"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
