import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateInterview } from "@workspace/api-client-react";
import { ROLES, DIFFICULTIES, INTERVIEW_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function InterviewSetup() {
  const [, setLocation] = useLocation();
  const createInterview = useCreateInterview();

  const [role, setRole] = useState(ROLES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]); // Default Medium
  const [type, setType] = useState(INTERVIEW_TYPES[0]);

  const handleStart = () => {
    createInterview.mutate({ data: { role, difficulty, interviewType: type } }, {
      onSuccess: (data) => {
        setLocation(`/interview/${data.id}`);
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-4 pb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Configure Session</CardTitle>
              <CardDescription className="text-base mt-1">Define the parameters for your AI interview practice.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Target Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Topic Focus</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleStart} 
                disabled={createInterview.isPending} 
                className="w-full h-14 text-lg font-medium gap-2"
              >
                {createInterview.isPending ? "Initializing..." : (
                  <>
                    Initialize Environment <Rocket className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}