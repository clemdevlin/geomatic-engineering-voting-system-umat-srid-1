import { useState } from "react"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

const CandidateSchema = z.object({
  name: z.string().min(1, "Candidate name is required"),
})

const PositionSchema = z.object({
  name: z.string().min(1, "Position name is required"),
  candidates: z.array(CandidateSchema).min(1, "At least one candidate is required"),
})

const ElectionSchema = z.object({
  name: z.string().min(5, "Election name must be at least 5 characters"),
  start_at: z.string().min(1, "Start time is required"),
  end_at: z.string().min(1, "End time is required"),
  positions: z.array(PositionSchema).min(1, "At least one position is required"),
})


export default function CreateElection() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const methods = useForm({
    resolver: zodResolver(ElectionSchema),
    defaultValues: {
      name: "",
      start_at: "",
      end_at: "",
      positions: [{ name: "", candidates: [{ name: "" }] }],
    },
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods

  const {
    fields: positionFields,
    append: addPosition,
  } = useFieldArray({
    control,
    name: "positions",
  })

  const handleFinalSubmit = async (data) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("http://localhost:5000/api/admin/elections/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setResult(json)
    } catch (err) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <Card className="max-w-3xl mx-auto mt-10 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <Progress value={(step / 3) * 100} className="h-2" />
          <h2 className="text-xl font-semibold">Create Election</h2>

          <form onSubmit={handleSubmit(handleFinalSubmit)}>
            {/* Step 1 - Election Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Election Name</Label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start At</Label>
                    <Input type="datetime-local" {...register("start_at")} />
                    {errors.start_at && <p className="text-red-500 text-sm">{errors.start_at.message}</p>}
                  </div>
                  <div>
                    <Label>End At</Label>
                    <Input type="datetime-local" {...register("end_at")} />
                    {errors.end_at && <p className="text-red-500 text-sm">{errors.end_at.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Positions & Candidates */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium">Positions & Candidates</h3>
                {positionFields.map((pos, i) => {
                  const {
                    fields: candidateFields,
                    append: addCandidate,
                  } = useFieldArray({
                    control,
                    name: `positions.${i}.candidates`,
                  })

                  return (
                    <div key={pos.id} className="p-3 border rounded-lg space-y-2">
                      <Input
                        placeholder="Position name"
                        {...register(`positions.${i}.name`)}
                      />
                      {errors.positions?.[i]?.name && (
                        <p className="text-red-500 text-sm">{errors.positions[i]?.name?.message}</p>
                      )}

                      {candidateFields.map((cand, j) => (
                        <div key={cand.id}>
                          <Input
                            placeholder={`Candidate ${j + 1}`}
                            {...register(`positions.${i}.candidates.${j}.name`)}
                          />
                          {errors.positions?.[i]?.candidates?.[j]?.name && (
                            <p className="text-red-500 text-sm">
                              {errors.positions[i]?.candidates?.[j]?.name?.message}
                            </p>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addCandidate({ name: "" })}
                      >
                        + Add Candidate
                      </Button>
                    </div>
                  )
                })}
                <Button type="button" onClick={() => addPosition({ name: "", candidates: [{ name: "" }] })}>
                  + Add Position
                </Button>
              </div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium">Review</h3>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(methods.getValues(), null, 2)}
                </pre>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Submit Election"}
                </Button>
                {result && (
                  <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs mt-3 overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </form>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  )
}
