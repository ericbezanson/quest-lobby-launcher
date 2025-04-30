import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLobby } from "@/contexts/LobbyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Users, Circle, RefreshCw } from "lucide-react";
import PlayersList from "@/components/PlayersList";
import OptionalRolesList from "@/components/OptionalRolesList";
import GameCards from "@/components/GameCards";
import EyesClosedInstructions from "@/components/EyesClosedInstructions";

const GameSetup = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { getLobby, currentPlayer, resetGame, refreshLobby } = useLobby();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const lobby = getLobby(lobbyId || "");
  const isHost = currentPlayer?.isHost || false;
  
  useEffect(() => {
    if (!lobbyId || !lobby) {
      toast.error("Lobby not found");
      navigate("/");
      return;
    }
    
    if (!lobby.gameStarted) {
      navigate(`/lobby/${lobbyId}`);
    }
    
    // Set up periodic refresh of lobby data
    const refreshInterval = setInterval(() => {
      if (lobbyId) {
        refreshLobby(lobbyId);
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, [lobby, lobbyId, navigate, refreshLobby]);

  const handleResetGame = () => {
    if (!lobbyId) return;
    resetGame(lobbyId);
    navigate(`/lobby/${lobbyId}`);
  };

  const handleRefresh = () => {
    if (!lobbyId) return;
    
    setIsRefreshing(true);
    refreshLobby(lobbyId);
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (!lobby) {
    return null;
  }

  return (
    <Layout background="parchment">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-quest-gold bg-quest-parchment/90 shadow-lg mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-quest-royal-purple medieval-heading">
                    Game Setup: {lobby.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Circle size={10} fill="#4CAF50" className="text-green-500" />
                    Game is active
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <Users size={20} className="text-quest-royal-purple" />
                    {lobby.players.length} players
                  </span>
                  <Button
                    variant="outline"
                    className="border-quest-gold text-quest-royal-purple p-2"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="bg-quest-parchment p-3 rounded border border-quest-gold">
                  <h3 className="text-lg font-semibold text-quest-royal-purple">First Player</h3>
                  <p className="font-bold text-lg text-quest-royal-purple">
                    {lobby.firstPlayer?.name}
                  </p>
                </div>
                
                {isHost && (
                  <Button 
                    variant="outline" 
                    className="border-quest-gold text-quest-royal-purple"
                    onClick={handleResetGame}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Lobby
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6">
            <GameCards lobbyId={lobbyId || ""} />
            
            <EyesClosedInstructions lobbyId={lobbyId || ""} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlayersList 
                lobbyId={lobbyId || ""} 
                showFirstPlayerIndicator={true} 
              />
              <OptionalRolesList 
                lobbyId={lobbyId || ""}
                editable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameSetup;
