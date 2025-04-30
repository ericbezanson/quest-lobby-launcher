
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLobby } from "@/contexts/LobbyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import LobbyCard from "@/components/LobbyCard";
import { toast } from "sonner";

const JoinLobby = () => {
  const [lobbyId, setLobbyId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const { joinLobby, lobbies } = useLobby();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lobbyId.trim() || !playerName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const joined = joinLobby(lobbyId.trim(), playerName.trim());
    if (joined) {
      navigate(`/lobby/${lobbyId}`);
    }
  };

  const handleJoinFromList = (id: string) => {
    setLobbyId(id);
  };

  const availableLobbies = lobbies.filter(lobby => !lobby.gameStarted);

  return (
    <Layout background="parchment">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-quest-gold bg-quest-parchment/90 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2">
                <Users size={36} className="text-quest-royal-purple" />
              </div>
              <CardTitle className="text-2xl font-bold text-quest-royal-purple medieval-heading">
                Join Lobby
              </CardTitle>
              <CardDescription>
                Join an existing Quest game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lobbyId" className="text-quest-royal-purple">
                    Lobby ID
                  </Label>
                  <Input
                    id="lobbyId"
                    placeholder="Enter the lobby ID"
                    value={lobbyId}
                    onChange={(e) => setLobbyId(e.target.value)}
                    className="border-quest-gold focus-visible:ring-quest-royal-purple"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="playerName" className="text-quest-royal-purple">
                    Your Screen Name
                  </Label>
                  <Input
                    id="playerName"
                    placeholder="Enter your screen name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="border-quest-gold focus-visible:ring-quest-royal-purple"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-quest-royal-purple hover:bg-quest-light-purple quest-button"
                  size="lg"
                >
                  Join Lobby
                </Button>
              </form>
              
              {availableLobbies.length > 0 && (
                <>
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-quest-royal-purple mb-4">
                      Available Lobbies
                    </h3>
                    
                    <div className="space-y-4">
                      {availableLobbies.map(lobby => (
                        <LobbyCard 
                          key={lobby.id} 
                          lobbyId={lobby.id}
                          onJoin={handleJoinFromList}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default JoinLobby;
