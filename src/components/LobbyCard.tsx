
import { useLobby } from "@/contexts/LobbyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface LobbyCardProps {
  lobbyId: string;
  onJoin?: (lobbyId: string) => void;
}

const LobbyCard: React.FC<LobbyCardProps> = ({ lobbyId, onJoin }) => {
  const { getLobby } = useLobby();
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg medieval-heading text-quest-royal-purple">
            {lobby.name}
          </CardTitle>
          <Badge variant="outline" className="text-sm bg-quest-royal-purple text-white">
            <Users size={14} className="mr-1" />
            {lobby.players.length} {lobby.players.length === 1 ? "player" : "players"}
          </Badge>
        </div>
        <CardDescription className="text-slate-600">
          Host: {lobby.players.find(player => player.isHost)?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {onJoin && !lobby.gameStarted && (
          <Button 
            onClick={() => onJoin(lobbyId)} 
            className="w-full mt-4 bg-quest-royal-purple hover:bg-quest-light-purple text-white quest-button"
          >
            Join Lobby
          </Button>
        )}
        {lobby.gameStarted && (
          <Badge className="mt-2 bg-quest-light-purple">Game in progress</Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default LobbyCard;
