import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import "./App.css";

type TextResponse = {
    text: string;
    user: string;
    id?: string;
};

type Agent = {
    id: string;
    name: string;
};

export default function Chat() {
    const { agentId } = useParams();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<TextResponse[]>([]);

    const { data: agent, isLoading: isLoadingAgent } = useQuery({
        queryKey: ["agent", agentId],
        queryFn: async () => {
            const res = await fetch(`/api/agents/${agentId}`);
            const data = await res.json();
            return data as Agent;
        },
    });

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            const res = await fetch(`/api/${agentId}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    userId: "user",
                    roomId: `default-room-${agentId}`,
                }),
            });
            return res.json() as Promise<TextResponse[]>;
        },
        onSuccess: (data) => {
            setMessages((prev) => [...prev, ...data]);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: TextResponse = {
            text: input,
            user: "user",
            id: Date.now().toString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        mutation.mutate(input);
        setInput("");
    };

    return (
        <div className="w-full h-full flex flex-col bg-background">
            {/* Header */}
            <header className="w-full flex items-center h-12 px-4 border-b border-white/[0.08] bg-white/[0.02]">
                <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-white/5">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="ml-3">
                    {isLoadingAgent ? (
                        <div className="h-8 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-sm font-semibold gradient-text">
                                {agent?.name}
                            </h1>
                            <p className="text-xs text-muted-foreground">AI Agent</p>
                        </>
                    )}
                </div>
            </header>

            {/* Chat Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="w-full h-full px-4 py-4 space-y-4">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.id || `${message.user}-${message.text}`}
                                className={`flex ${
                                    message.user === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                        message.user === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-white/[0.03] border border-white/[0.08]"
                                    }`}
                                >
                                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-white/10">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Start a conversation by sending a message below
                            </p>
                        </div>
                    )}
                    {mutation.isPending && (
                        <div className="flex justify-start">
                            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-2.5 shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="w-full border-t border-white/[0.08] bg-white/[0.02] p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 h-9 bg-white/[0.03] border-white/[0.08] focus:border-primary/50"
                        disabled={mutation.isPending}
                    />
                    <Button
                        type="submit"
                        disabled={mutation.isPending || !input.trim()}
                        size="icon"
                        className="h-9 w-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
