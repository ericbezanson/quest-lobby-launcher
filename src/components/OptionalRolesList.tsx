
import React from "react";
import { useLobby, OptionalRole } from "@/contexts/LobbyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface OptionalRolesListProps {
  lobbyId: string;
  editable?: boolean;
}

const OptionalRolesList: React.FC<OptionalRolesListProps> = ({ 
  lobbyId, 
  editable = false 
}) => {
  const { getLobby, toggleOptionalRole, currentPlayer } = useLobby();
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }

  const isHost = currentPlayer?.isHost ?? false;
  const playerCount = lobby.players.length;

  // Filter roles based on min player count
  const availableRoles = lobby.optionalRoles.filter(
    role => playerCount >= role.minPlayers
  );

  // Separate into good and evil roles
  const goodRoles = availableRoles.filter(role => role.alignment === "good");
  const evilRoles = availableRoles.filter(role => role.alignment === "evil");

  // Handler for toggling roles
  const handleToggleRole = (roleId: string) => {
    if (editable && isHost) {
      toggleOptionalRole(lobbyId, roleId);
    }
  };

  const RoleItem = ({ role }: { role: OptionalRole }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{role.name}</span>
          <Badge 
            className={role.alignment === "good" 
              ? "bg-blue-600 text-white" 
              : "bg-red-600 text-white"
            }
          >
            {role.alignment === "good" ? "Good" : "Evil"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {role.minPlayers}+ players
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
      </div>
      {editable && isHost ? (
        <Switch 
          checked={role.selected} 
          onCheckedChange={() => handleToggleRole(role.id)}
          disabled={playerCount < role.minPlayers}
        />
      ) : (
        <Badge 
          variant={role.selected ? "default" : "outline"} 
          className={role.selected 
            ? "bg-green-600 text-white" 
            : "text-gray-500"
          }
        >
          {role.selected ? "Included" : "Excluded"}
        </Badge>
      )}
    </div>
  );

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg medieval-heading text-quest-royal-purple">
          Optional Roles
        </CardTitle>
        <CardDescription>
          {editable && isHost 
            ? "Select which optional roles to include in the game" 
            : "Roles included in this game"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-quest-royal-purple mb-2 border-b border-quest-gold pb-1">
              Good Roles
            </h3>
            <div className="space-y-2">
              {goodRoles.length > 0 ? (
                goodRoles.map(role => (
                  <RoleItem key={role.id} role={role} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No good roles available at this player count
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-quest-royal-purple mb-2 border-b border-quest-gold pb-1">
              Evil Roles
            </h3>
            <div className="space-y-2">
              {evilRoles.length > 0 ? (
                evilRoles.map(role => (
                  <RoleItem key={role.id} role={role} />
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No evil roles available at this player count
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionalRolesList;
