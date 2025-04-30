
import React from "react";
import { useLobby, OptionalRole } from "@/contexts/LobbyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface EyesClosedInstructionsProps {
  lobbyId: string;
}

const EyesClosedInstructions: React.FC<EyesClosedInstructionsProps> = ({ lobbyId }) => {
  const { getLobby } = useLobby();
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    return null;
  }

  const playerCount = lobby.players.length;
  const selectedOptionalRoles = lobby.optionalRoles.filter((role) => role.selected);
  
  // Define order for eyes closed phase
  const eyesClosedOrder = [
    { type: "morgan", text: "Morgan le Fey, wake up and point to a player. They will be seen as evil by Merlin." },
    ...selectedOptionalRoles
      .filter(role => role.alignment === "evil")
      .map(role => ({
        type: role.id,
        text: `${role.name}, wake up and see the other evil players.`
      })),
    { type: "evil", text: "All evil players (Morgan, Mordred, Oberon, and any Minions), wake up and see each other." },
    ...selectedOptionalRoles
      .filter(role => role.id === "merlin")
      .map(() => ({
        type: "merlin",
        text: "Merlin, wake up. You will see all evil players except Mordred."
      })),
    ...selectedOptionalRoles
      .filter(role => role.id === "percival")
      .map(() => ({
        type: "percival", 
        text: "Percival, wake up. You will see Merlin and Morgana, but you won't know which is which."
      }))
  ];

  return (
    <Card className="w-full border-quest-gold bg-quest-parchment">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg medieval-heading text-quest-royal-purple flex items-center">
              <EyeOff size={20} className="mr-2 text-quest-royal-purple" />
              Eyes Closed Phase Instructions
            </CardTitle>
            <CardDescription>
              Read these instructions during the eyes closed phase in order
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4 list-decimal list-outside ml-5">
          <li className="text-quest-royal-purple">
            <p>
              <strong>Have everyone close their eyes:</strong>{" "}
              "Everyone close your eyes and extend your fist in front of you."
            </p>
          </li>
          
          {eyesClosedOrder.map((instruction, index) => (
            <li key={instruction.type} className="text-quest-royal-purple">
              <div className="flex items-center">
                <EyeOff size={16} className="mr-2 text-quest-royal-purple" />
                <span>{instruction.text}</span>
              </div>
              <div className="flex items-center mt-1">
                <Eye size={16} className="mr-2 text-quest-royal-purple" />
                <span>"Now close your eyes."</span>
              </div>
            </li>
          ))}
          
          <li className="text-quest-royal-purple">
            <p>
              <strong>Conclusion:</strong>{" "}
              "Everyone should have their eyes closed. Everyone except {lobby.firstPlayer?.name} put your 
              thumb down. {lobby.firstPlayer?.name}, you are the first leader."
            </p>
          </li>
          
          <li className="text-quest-royal-purple">
            <p>
              <strong>Begin the game:</strong>{" "}
              "Everyone open your eyes. Let the first quest begin!"
            </p>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default EyesClosedInstructions;
