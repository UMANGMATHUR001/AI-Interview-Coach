import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useGetInterview, getGetInterviewQueryKey, useEndInterview } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, SquareSquare, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewRoom() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const interviewId = Number(id);
  
  const { data: interview, isLoading: isInterviewLoading } = useGetInterview(interviewId, {
    query: { enabled: !!interviewId, queryKey: getGetInterviewQueryKey(interviewId) }
  });
  
  const endInterview = useEndInterview();

  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load existing messages when interview data arrives
  useEffect(() => {
    if (interview?.messages && messages.length === 0 && !isStreaming) {
      setMessages(interview.messages.map(m => ({ role: m.role, content: m.content })));
    }
  }, [interview, messages.length, isStreaming]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming || interview?.status === "completed") return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsStreaming(true);
    
    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch(`/api/interviews/${interviewId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: userMsg }),
      });
      
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.content) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  const lastMsg = newMsgs[newMsgs.length - 1];
                  lastMsg.content += data.content;
                  return newMsgs;
                });
              }
            } catch (e) {
              console.error("Parse error stream chunk", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream failed", err);
    } finally {
      setIsStreaming(false);
      // Invalidate to fetch fresh message data behind the scenes
      queryClient.invalidateQueries({ queryKey: getGetInterviewQueryKey(interviewId) });
    }
  };

  const handleEnd = () => {
    endInterview.mutate({ id: interviewId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetInterviewQueryKey(interviewId) });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isInterviewLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) return <div>Interview not found.</div>;

  const isCompleted = interview.status === "completed";

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-4xl mx-auto pt-6 px-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{interview.role} Interview</h2>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">{interview.difficulty}</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">{interview.interviewType}</span>
            {isCompleted && <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">Completed</span>}
          </div>
        </div>
        {!isCompleted ? (
          <Button variant="destructive" size="sm" onClick={handleEnd} disabled={endInterview.isPending || isStreaming} className="gap-2">
            <SquareSquare className="h-4 w-4" /> End Session
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-4 pb-4 space-y-6"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'}`}>
                {msg.role === "user" ? <UserIcon className="h-5 w-5" /> : <Bot className="h-5 w-5 text-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-card border border-border/50 rounded-tl-sm text-foreground prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border"
              }`}>
                {msg.content ? (
                   <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  msg.role === "assistant" && isStreaming && i === messages.length - 1 ? (
                    <div className="flex items-center gap-1 h-5">
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                  ) : null
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {!isCompleted && (
        <div className="shrink-0 pt-4 bg-background border-t border-border/50">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response... (Shift+Enter for newline)"
              className="min-h-[80px] max-h-[200px] pr-14 resize-none bg-card/50"
              disabled={isStreaming}
            />
            <Button 
              size="icon" 
              className="absolute right-3 bottom-3 h-8 w-8 rounded-full"
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      )}
      
      {isCompleted && (
        <div className="shrink-0 p-4 mt-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-primary block">Session Completed</span>
            <span className="text-muted-foreground">The interview has ended. Check your analytics.</span>
          </div>
          <Button onClick={() => setLocation("/analytics")} variant="outline" className="border-primary/30">
            View Analytics
          </Button>
        </div>
      )}
    </div>
  );
}