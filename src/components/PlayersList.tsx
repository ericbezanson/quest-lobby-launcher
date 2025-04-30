
import React, { useState } from "react";
import { useLobby } from "@/contexts/LobbyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, User, UserPlus, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PlayersListProps {
  lobbyId: string;
  showFirstPlayerIndicator?: boolean;
}

interface AddPlayerFormValues {
  playerName: string;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  lobbyId, 
  showFirstPlayerIndicator = false 
}) => {
  const { getLobby, addPlayerLocally, removePlayerLocally, currentPlayer } = useLobby();
  const [isAdding, setIsAdding] = useState(false);
  
  const form = useForm<AddPlayerFormValues>({
    defaultValues: {
      playerName: ""
    }
  });
  
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }
  
  const handleAddPlayer = (values: AddPlayerFormValues) => {
    if (!values.playerName.trim()) {
      toast.error("Player name cannot be empty");
      return;
    }
    
    if (lobby.players.some(p => p.name.toLowerCase() === values.playerName.trim().toLowerCase())) {
      toast.error("A player with this name already exists");
      return;
    }
    
    addPlayerLocally(lobbyId, values.playerName.trim());
    form.reset();
    setIsAdding(false);
  };
  
  const handleRemovePlayer = (playerId: string) => {
    removePlayerLocally(lobbyId, playerId);
  };
  
  const canRemovePlayers = lobby.players.length > 1;

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg medieval-heading text-quest-royal-purple flex items-center">
            Players <Badge className="ml-2 bg-quest-royal-purple">{lobby.players.length}</Badge>
          </CardTitle>
          {!isAdding && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsAdding(true)}
              className="border-quest-gold text-quest-royal-purple"
            >
              <UserPlus size={16} className="mr-1" /> Add Player
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPlayer)} className="flex gap-2 mb-4">
              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter player name" 
                        className="bg-white"
                        autoFocus
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-quest-royal-purple hover:bg-quest-light-purple"
              >
                Add
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                className="border-red-500 text-red-500"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </form>
          </Form>
        )}
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
              <div className="flex items-center gap-1">
                {player.isHost && (
                  <Badge variant="outline" className="flex items-center gap-1 border-quest-gold text-quest-royal-purple mr-2">
                    <Crown size={14} />
                    Host
                  </Badge>
                )}
                {!player.isHost && canRemovePlayers && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    onClick={() => handleRemovePlayer(player.id)}
                  >
                    <UserMinus size={16} />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
