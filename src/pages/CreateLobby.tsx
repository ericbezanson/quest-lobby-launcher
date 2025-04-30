
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLobby } from "@/contexts/LobbyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad } from "lucide-react";
import { toast } from "sonner";

const CreateLobby = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const { createLobby } = useLobby();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lobbyName.trim() || !playerName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const lobbyId = createLobby(lobbyName.trim(), playerName.trim());
    navigate(`/lobby/${lobbyId}`);
  };

  return (
    <Layout background="parchment">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-quest-gold bg-quest-parchment/90 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2">
                <Gamepad size={36} className="text-quest-royal-purple" />
              </div>
              <CardTitle className="text-2xl font-bold text-quest-royal-purple medieval-heading">
                Create New Lobby
              </CardTitle>
              <CardDescription>
                Host a new game of Quest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lobbyName" className="text-quest-royal-purple">
                    Lobby Name
                  </Label>
                  <Input
                    id="lobbyName"
                    placeholder="Enter a name for your lobby"
                    value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)}
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
                  Create Lobby
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLobby;
