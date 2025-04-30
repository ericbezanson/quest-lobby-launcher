
import React from "react";
import { useLobby } from "@/contexts/LobbyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, User } from "lucide-react";

interface PlayersListProps {
  lobbyId: string;
  showFirstPlayerIndicator?: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  lobbyId, 
  showFirstPlayerIndicator = false 
}) => {
  const { getLobby } = useLobby();
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg medieval-heading text-quest-royal-purple flex items-center">
          Players <Badge className="ml-2 bg-quest-royal-purple">{lobby.players.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {lobby.players.map((player) => (
            <li 
              key={player.id} 
              className={`flex items-center justify-between p-2 rounded-md ${
                player.isHost ? "bg-quest-royal-purple/10" : ""
              } ${
                showFirstPlayerIndicator && lobby.firstPlayer?.id === player.id 
                  ? "border-l-4 border-quest-gold" 
                  : ""
              }`}
            >
              <div className="flex items-center">
                <User size={18} className="mr-2 text-quest-royal-purple" />
                <span>{player.name}</span>
                {showFirstPlayerIndicator && lobby.firstPlayer?.id === player.id && (
                  <Badge className="ml-2 bg-quest-gold text-quest-royal-purple">Starts First</Badge>
                )}
              </div>
              {player.isHost && (
                <Badge variant="outline" className="flex items-center gap-1 border-quest-gold text-quest-royal-purple">
                  <Crown size={14} />
                  Host
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
