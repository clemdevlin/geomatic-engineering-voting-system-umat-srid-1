import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// ElectionBallot Component
// ------------------------
// Props:
// - office: string (e.g. "Mayor")
// - title: string (optional heading)
// - candidates: Array<{ id: string|number, name: string, party?: string, bio?: string }>
// - allowWriteIn: boolean (default: false)
// - disabled: boolean
// - onSubmit: function({ selection, writeIn }) => Promise|void
// - confirmBeforeSubmit: boolean (default: true)
//
// Usage example:
// <ElectionBallot
//   office="Mayor"
//   title="City of Example — General Election"
//   candidates={[{id:1,name:'Alice'},{id:2,name:'Bob'}]}
//   allowWriteIn
//   onSubmit={(result) => console.log('voted', result)}
///>

export default function ElectionBallot({
  office = "",
  title = "",
  candidates = [],
  allowWriteIn = false,
  disabled = false,
  onSubmit = () => {},
  confirmBeforeSubmit = true,
}) {
  const [selection, setSelection] = useState(null);
  const [writeIn, setWriteIn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    // Reset when candidates change
    setSelection(null);
    setWriteIn("");
  }, [JSON.stringify(candidates)]);

  // Keyboard navigation for radiogroup
  const handleKeyDown = (e) => {
    if (!listRef.current) return;
    const radios = Array.from(listRef.current.querySelectorAll('[role="radio"]'));
    if (!radios.length) return;
    const currentIndex = radios.findIndex((r) => r.getAttribute("data-id") === String(selection));

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (currentIndex + 1) % radios.length;
      const id = radios[next].getAttribute("data-id");
      setSelection(id);
      radios[next].focus();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (currentIndex - 1 + radios.length) % radios.length;
      const id = radios[prev].getAttribute("data-id");
      setSelection(id);
      radios[prev].focus();
    }
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleOptionClick = (id) => {
    if (disabled || submitting) return;
    setSelection(String(id));
  };

  const submit = async () => {
    if (disabled) return;
    if (!selection && !(allowWriteIn && writeIn.trim())) {
      // no selection
      const el = document.getElementById("ballot-error");
      if (el) el.classList.add("animate-pulse");
      setTimeout(() => el && el.classList.remove("animate-pulse"), 600);
      return;
    }

    const payload = {
      selection: selection,
      writeIn: allowWriteIn ? writeIn.trim() : "",
    };

    try {
      setSubmitting(true);
      const res = onSubmit(payload) || Promise.resolve();
      await Promise.resolve(res);
      // keep it simple: we'll assume success. In real app handle errors.
    } catch (err) {
      console.error("Submit failed", err);
      // you might want to show an error toast here
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-semibold">
            {title || (office ? `${office} — Ballot` : "Ballot")}
          </CardTitle>
          {office && <p className="text-sm text-muted-foreground mt-0.5">Office: {office}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={listRef}
          role="radiogroup"
          aria-labelledby="ballot-label"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="space-y-3"
        >
          <h3 id="ballot-label" className="sr-only">
            Choices
          </h3>

          {candidates.map((cand) => {
            const id = String(cand.id);
            const selected = String(selection) === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                data-id={id}
                onClick={() => handleOptionClick(id)}
                className={`w-full text-left p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-shadow flex items-start gap-3 ${
                  selected ? "border-sky-500 bg-sky-50 shadow-sm" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selected ? "bg-sky-600 border-sky-600" : "bg-white border-zinc-300"
                    }`}
                    aria-hidden
                  >
                    {selected ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-medium">{cand.name}</div>
                      {cand.party && <div className="text-sm text-muted-foreground">{cand.party}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{cand.id}</div>
                  </div>

                  {cand.bio && <p className="mt-2 text-sm text-muted-foreground">{cand.bio}</p>}
                </div>
              </button>
            );
          })}

          {allowWriteIn && (
            <div className="pt-1">
              <label className="text-sm font-medium">Write-in</label>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Write-in candidate name"
                  value={writeIn}
                  onChange={(e) => setWriteIn(e.target.value)}
                  disabled={disabled || submitting}
                />
                <Button
                  variant={writeIn ? "secondary" : "ghost"}
                  onClick={() => {
                    if (!writeIn.trim()) return;
                    setSelection(null);
                  }}
                >
                  Use
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Selecting a write-in will override any named candidate selection when you submit.</p>
            </div>
          )}

          <div id="ballot-error" className="text-sm text-rose-600 mt-2 hidden" />

          <div className="flex items-center gap-3 mt-4">
            {confirmBeforeSubmit ? (
              <>
                <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                  <DialogTrigger asChild>
                    <Button disabled={disabled || submitting} className="px-4 py-2">
                      Review & Submit
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Review your ballot</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 mt-2">
                      <p className="text-sm text-muted-foreground">Please confirm your selection before submitting. This action cannot be undone.</p>

                      <div className="rounded-md border p-3">
                        <div className="text-sm font-medium">Selection</div>
                        <div className="mt-2">
                          {selection ? (
                            <div className="text-sm">{candidates.find((c) => String(c.id) === String(selection))?.name || selection}</div>
                          ) : allowWriteIn && writeIn.trim() ? (
                            <div className="text-sm">Write-in: {writeIn.trim()}</div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No selection made.</div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={submit} disabled={submitting}>
                          {submitting ? "Submitting..." : "Confirm & Submit"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  disabled={disabled || submitting}
                  onClick={() => setSelection(null) || setWriteIn("")}
                >
                  Clear
                </Button>
              </>
            ) : (
              <>
                <Button onClick={submit} disabled={disabled || submitting}>
                  {submitting ? "Submitting..." : "Submit Vote"}
                </Button>
                <Button
                  variant="outline"
                  disabled={disabled || submitting}
                  onClick={() => setSelection(null) || setWriteIn("")}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
