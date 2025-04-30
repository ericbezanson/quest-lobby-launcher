
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLobby } from "@/contexts/LobbyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Play, Users, LogOut } from "lucide-react";
import PlayersList from "@/components/PlayersList";
import OptionalRolesList from "@/components/OptionalRolesList";

const Lobby = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { getLobby, currentPlayer, leaveLobby, startGame } = useLobby();
  
  const lobby = getLobby(lobbyId || "");
  const isHost = currentPlayer?.isHost || false;
  
  useEffect(() => {
    if (!lobbyId || !lobby) {
      toast.error("Lobby not found");
      navigate("/");
      return;
    }
    
    if (lobby.gameStarted) {
      navigate(`/game-setup/${lobbyId}`);
    }
  }, [lobby, lobbyId, navigate]);

  const handleStartGame = () => {
    if (!lobbyId) return;
    
    if (lobby?.players.length < 4) {
      toast.error("Need at least 4 players to start a game");
      return;
    }
    
    startGame(lobbyId);
    navigate(`/game-setup/${lobbyId}`);
  };

  const handleLeaveLobby = () => {
    if (!lobbyId || !currentPlayer) return;
    leaveLobby(lobbyId, currentPlayer.id);
    navigate("/");
  };

  if (!lobby) {
    return null;
  }

  const copyLobbyId = () => {
    navigator.clipboard.writeText(lobbyId || "");
    toast.success("Lobby ID copied to clipboard");
  };

  return (
    <Layout background="parchment">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-quest-gold bg-quest-parchment/90 shadow-lg mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-quest-royal-purple medieval-heading">
                    {lobby.name}
                  </CardTitle>
                  <CardDescription>
                    Waiting for players to join
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="border-quest-gold text-quest-royal-purple"
                  onClick={copyLobbyId}
                >
                  Lobby ID: {lobbyId?.substring(0, 6)}...
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-quest-royal-purple" />
                  <span>
                    {lobby.players.length} {lobby.players.length === 1 ? "player" : "players"} in lobby
                  </span>
                </div>
                
                <div className="flex gap-3">
                  {isHost && (
                    <Button 
                      className="bg-quest-royal-purple hover:bg-quest-light-purple quest-button flex items-center"
                      disabled={lobby.players.length < 4}
                      onClick={handleStartGame}
                    >
                      <Play size={16} className="mr-2" />
                      Start Game
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={handleLeaveLobby}
                  >
                    <LogOut size={16} className="mr-2" />
                    Leave Lobby
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlayersList lobbyId={lobbyId || ""} />
            <OptionalRolesList lobbyId={lobbyId || ""} editable={isHost} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lobby;
