
import React from "react";
import { useLobby } from "@/contexts/LobbyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameCardsProps {
  lobbyId: string;
}

const GameCards: React.FC<GameCardsProps> = ({ lobbyId }) => {
  const { getLobby } = useLobby();
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }

  const playerCount = lobby.players.length;
  
  // These are the standard number of roles based on player count
  const standardRoles = {
    loyalServants: getStandardRoleCount("loyal", playerCount),
    minions: getStandardRoleCount("minion", playerCount)
  };

  // Get selected optional roles counts
  const selectedOptionalRoles = {
    good: lobby.optionalRoles.filter(r => r.selected && r.alignment === "good").length,
    evil: lobby.optionalRoles.filter(r => r.selected && r.alignment === "evil").length
  };

  // Calculate final roles
  const finalRoles = {
    loyalServants: Math.max(0, standardRoles.loyalServants - selectedOptionalRoles.good),
    minions: Math.max(0, standardRoles.minions - selectedOptionalRoles.evil),
    optionalGood: lobby.optionalRoles.filter(r => r.selected && r.alignment === "good"),
    optionalEvil: lobby.optionalRoles.filter(r => r.selected && r.alignment === "evil")
  };

  // Calculate tokens needed
  const tokens = getTokens(playerCount);

  // Get quest team size information
  const questInfo = getQuestTeamSizes(playerCount);

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader>
        <CardTitle className="text-lg medieval-heading text-quest-royal-purple">
          Game Setup Information
        </CardTitle>
        <CardDescription>
          Based on {playerCount} players and selected optional roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-semibold text-quest-royal-purple mb-2 border-b border-quest-gold pb-1">
              Character Cards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3 bg-blue-50">
                <h4 className="font-medium text-blue-800">Good Side ({finalRoles.loyalServants + finalRoles.optionalGood.length})</h4>
                <ul className="mt-2 space-y-1">
                  {finalRoles.loyalServants > 0 && (
                    <li className="flex justify-between">
                      <span>Loyal Servant of Arthur</span>
                      <span className="font-semibold">{finalRoles.loyalServants}</span>
                    </li>
                  )}
                  {finalRoles.optionalGood.map(role => (
                    <li key={role.id} className="flex justify-between">
                      <span>{role.name}</span>
                      <span className="font-semibold">1</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-red-50">
                <h4 className="font-medium text-red-800">Evil Side ({finalRoles.minions + finalRoles.optionalEvil.length})</h4>
                <ul className="mt-2 space-y-1">
                  {finalRoles.minions > 0 && (
                    <li className="flex justify-between">
                      <span>Minion of Mordred</span>
                      <span className="font-semibold">{finalRoles.minions}</span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span>Morgan le Fey</span>
                    <span className="font-semibold">1</span>
                  </li>
                  {finalRoles.optionalEvil.map(role => (
                    <li key={role.id} className="flex justify-between">
                      <span>{role.name}</span>
                      <span className="font-semibold">1</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-quest-royal-purple mb-2 border-b border-quest-gold pb-1">
              Tokens Required
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Team Tokens</span>
                <span className="font-semibold">{tokens.team}</span>
              </li>
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Amulets</span>
                <span className="font-semibold">{tokens.amulets}</span>
              </li>
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Character Tokens</span>
                <span className="font-semibold">{playerCount}</span>
              </li>
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Loyalty Cards</span>
                <span className="font-semibold">{playerCount >= 6 ? 2 : 0}</span>
              </li>
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Leader Token</span>
                <span className="font-semibold">1</span>
              </li>
              <li className="flex justify-between border rounded-md p-2 bg-white">
                <span>Magic Token</span>
                <span className="font-semibold">1</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-quest-royal-purple mb-2 border-b border-quest-gold pb-1">
              Quest Team Sizes
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quest</TableHead>
                    <TableHead>Team Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questInfo.map((size, index) => (
                    <TableRow key={index}>
                      <TableCell>Quest {index + 1}</TableCell>
                      <TableCell>{size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions

function getStandardRoleCount(type: "loyal" | "minion", playerCount: number): number {
  if (type === "loyal") {
    // Loyal Servants of Arthur based on player count
    const loyalServantsByPlayerCount = [0, 0, 0, 2, 3, 3, 3, 4, 4, 4];
    return loyalServantsByPlayerCount[playerCount] || 0;
  } else {
    // Minions of Mordred based on player count
    const minionsByPlayerCount = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2];
    return minionsByPlayerCount[playerCount] || 0;
  }
}

function getTokens(playerCount: number) {
  let amulets = 0;
  
  if (playerCount >= 6 && playerCount <= 7) {
    amulets = 1;
  } else if (playerCount >= 8) {
    amulets = 2;
  }
  
  // Number of team tokens
  const teamTokens = 5;
  
  return {
    team: teamTokens,
    amulets
  };
}

function getQuestTeamSizes(playerCount: number): number[] {
  // Quest team sizes based on player count
  const questTeamSizes: Record<number, number[]> = {
    4: [2, 3, 2, 3, 3],
    5: [2, 3, 3, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5]
  };
  
  return questTeamSizes[playerCount] || [0, 0, 0, 0, 0];
}

export default GameCards;
