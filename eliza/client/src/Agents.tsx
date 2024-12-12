import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Bot } from "lucide-react";
import "./App.css";

type Agent = {
    id: string;
    name: string;
};

function Agents() {
    const navigate = useNavigate();
    const { data: agents, isLoading } = useQuery({
        queryKey: ["agents"],
        queryFn: async () => {
            const res = await fetch("/api/agents");
            const data = await res.json();
            return data.agents as Agent[];
        },
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-24 px-8 bg-background">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col items-center space-y-16">
                    <div className="flex flex-col items-center space-y-12">
                        <div className="h-48 w-48 rounded-3xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-white/10">
                            <Bot className="h-32 w-32" />
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-6xl title-gradient">
                                AIgentLayer
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Choose an agent to start your conversation
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                            {agents?.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="cursor-pointer h-auto py-12 px-8 flex flex-col items-center gap-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.08] rounded-3xl group hover:scale-[1.02]"
                                    onClick={() => navigate(`/${agent.id}/chat`)}
                                >
                                    <div className="h-64 w-64 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary/20 transition-all duration-300">
                                        <Bot className="h-40 w-40" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-3 text-center">
                                        <h2 className="text-2xl font-semibold gradient-text">{agent.name}</h2>
                                        <p className="text-sm text-muted-foreground">Click to chat</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Agents;
