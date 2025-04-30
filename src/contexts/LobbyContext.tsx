
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

export interface OptionalRole {
  id: string;
  name: string;
  description: string;
  alignment: "good" | "evil";
  selected: boolean;
  minPlayers: number;
}

export interface Lobby {
  id: string;
  name: string;
  players: Player[];
  optionalRoles: OptionalRole[];
  gameStarted: boolean;
  firstPlayer?: Player;
}

interface LobbyContextType {
  lobbies: Lobby[];
  currentLobby: Lobby | null;
  currentPlayer: Player | null;
  createLobby: (name: string, hostName: string) => string;
  joinLobby: (lobbyId: string, playerName: string) => boolean;
  getLobby: (lobbyId: string) => Lobby | undefined;
  leaveLobby: (lobbyId: string, playerId: string) => void;
  toggleOptionalRole: (lobbyId: string, roleId: string) => void;
  startGame: (lobbyId: string) => void;
  resetGame: (lobbyId: string) => void;
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

// Optional roles as per the Quest game rules
const DEFAULT_OPTIONAL_ROLES: OptionalRole[] = [
  {
    id: "blind-hunter",
    name: "Blind Hunter",
    description: "On the side of Evil. They do not know who the other Minions of Mordred are.",
    alignment: "evil",
    selected: true, // Often recommended as default
    minPlayers: 4
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "On the side of Good. They know if the first Leader is on the side of Good or Evil.",
    alignment: "good",
    selected: false,
    minPlayers: 6
  },
  {
    id: "troublemaker",
    name: "Troublemaker",
    description: "On the side of Good. If investigated by any ability that checks loyalty, they must lie and indicate they are Evil.",
    alignment: "good",
    selected: false,
    minPlayers: 6
  },
  {
    id: "youth",
    name: "Youth",
    description: "On the side of Good. If the Magic token is placed on them, they must play a Fail instead of a Success for that Quest.",
    alignment: "good",
    selected: false,
    minPlayers: 6
  },
  {
    id: "duke",
    name: "Duke",
    description: "On the side of Good. They may drop the hand of any player during Good's Last Chance after roles are revealed.",
    alignment: "good",
    selected: false,
    minPlayers: 6
  },
  {
    id: "archduke",
    name: "Archduke",
    description: "On the side of Good. They may switch one hand of any player during Good's Last Chance after the Minions of Mordred drop their hands.",
    alignment: "good",
    selected: false,
    minPlayers: 9
  },
  {
    id: "apprentice",
    name: "Apprentice",
    description: "On the side of Good. They only raise one hand during Good's Last Chance.",
    alignment: "good",
    selected: false,
    minPlayers: 6
  },
  {
    id: "brute",
    name: "Brute",
    description: "On the side of Evil. They may Fail only the first three Quests, but may play Success on any Quest.",
    alignment: "evil",
    selected: false,
    minPlayers: 7
  },
  {
    id: "lunatic",
    name: "Lunatic",
    description: "On the side of Evil. They must Fail every Quest they are on, unless the Magic token has been placed on them.",
    alignment: "evil",
    selected: false,
    minPlayers: 7
  },
  {
    id: "mutineer",
    name: "Mutineer",
    description: "On the side of Evil. During Good's Last Chance, they may elect not to drop their hands.",
    alignment: "evil",
    selected: false,
    minPlayers: 7
  },
  {
    id: "trickster",
    name: "Trickster",
    description: "On the side of Evil. They may give a false answer to any ability that checks loyalty, such as the Cleric or an Amulet.",
    alignment: "evil",
    selected: false,
    minPlayers: 6
  },
  {
    id: "revealer",
    name: "Revealer",
    description: "On the side of Evil. They must reveal their identity after the 3rd failed Quest.",
    alignment: "evil",
    selected: false,
    minPlayers: 7
  },
];

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  // Helper function to generate a simple unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const createLobby = (name: string, hostName: string): string => {
    const lobbyId = generateId();
    const playerId = generateId();
    
    // Create a new player as the host
    const host: Player = {
      id: playerId,
      name: hostName,
      isHost: true
    };
    
    // Create optional roles based on the defaults
    const optionalRoles = JSON.parse(JSON.stringify(DEFAULT_OPTIONAL_ROLES));
    
    // Create the lobby
    const newLobby: Lobby = {
      id: lobbyId,
      name,
      players: [host],
      optionalRoles,
      gameStarted: false
    };
    
    setLobbies(prevLobbies => [...prevLobbies, newLobby]);
    setCurrentLobby(newLobby);
    setCurrentPlayer(host);
    
    toast.success(`Lobby "${name}" created successfully!`);
    return lobbyId;
  };

  const joinLobby = (lobbyId: string, playerName: string): boolean => {
    const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId);
    
    if (lobbyIndex === -1) {
      toast.error("Lobby not found!");
      return false;
    }
    
    const lobby = lobbies[lobbyIndex];
    
    if (lobby.gameStarted) {
      toast.error("Game has already started!");
      return false;
    }
    
    // Check if the name is already taken in this lobby
    if (lobby.players.some(player => player.name === playerName)) {
      toast.error("Name already taken in this lobby!");
      return false;
    }
    
    // Create a new player
    const newPlayer: Player = {
      id: generateId(),
      name: playerName,
      isHost: false
    };
    
    // Add the player to the lobby
    const updatedLobby = {
      ...lobby,
      players: [...lobby.players, newPlayer]
    };
    
    // Update the lobbies state
    const updatedLobbies = [...lobbies];
    updatedLobbies[lobbyIndex] = updatedLobby;
    
    setLobbies(updatedLobbies);
    setCurrentLobby(updatedLobby);
    setCurrentPlayer(newPlayer);
    
    toast.success(`Joined lobby "${lobby.name}" successfully!`);
    return true;
  };

  const getLobby = (lobbyId: string): Lobby | undefined => {
    return lobbies.find(lobby => lobby.id === lobbyId);
  };

  const leaveLobby = (lobbyId: string, playerId: string): void => {
    const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId);
    
    if (lobbyIndex === -1) {
      return;
    }
    
    const lobby = lobbies[lobbyIndex];
    const playerIndex = lobby.players.findIndex(player => player.id === playerId);
    
    if (playerIndex === -1) {
      return;
    }
    
    const player = lobby.players[playerIndex];
    const isHost = player.isHost;
    
    let updatedLobbies = [...lobbies];
    
    // If the player is the host and there are other players, transfer host status
    if (isHost && lobby.players.length > 1) {
      const updatedPlayers = [...lobby.players];
      updatedPlayers.splice(playerIndex, 1);
      
      // Make the next player the host
      updatedPlayers[0].isHost = true;
      
      updatedLobbies[lobbyIndex] = {
        ...lobby,
        players: updatedPlayers
      };
      
      toast.info(`Host left. ${updatedPlayers[0].name} is now the host.`);
    } 
    // If the host is leaving and they're the only player, remove the lobby
    else if (isHost && lobby.players.length === 1) {
      updatedLobbies.splice(lobbyIndex, 1);
      toast.info("Lobby closed as the host left.");
    } 
    // Regular player leaving
    else {
      const updatedPlayers = [...lobby.players];
      updatedPlayers.splice(playerIndex, 1);
      
      updatedLobbies[lobbyIndex] = {
        ...lobby,
        players: updatedPlayers
      };
      
      toast.info(`${player.name} left the lobby.`);
    }
    
    setLobbies(updatedLobbies);
    
    // If the current player is leaving, reset the current lobby and player
    if (playerId === currentPlayer?.id) {
      setCurrentLobby(null);
      setCurrentPlayer(null);
    }
  };

  const toggleOptionalRole = (lobbyId: string, roleId: string): void => {
    const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId);
    
    if (lobbyIndex === -1) {
      return;
    }
    
    const lobby = lobbies[lobbyIndex];
    const roleIndex = lobby.optionalRoles.findIndex(role => role.id === roleId);
    
    if (roleIndex === -1) {
      return;
    }
    
    const updatedOptionalRoles = [...lobby.optionalRoles];
    updatedOptionalRoles[roleIndex] = {
      ...updatedOptionalRoles[roleIndex],
      selected: !updatedOptionalRoles[roleIndex].selected
    };
    
    const updatedLobby = {
      ...lobby,
      optionalRoles: updatedOptionalRoles
    };
    
    const updatedLobbies = [...lobbies];
    updatedLobbies[lobbyIndex] = updatedLobby;
    
    setLobbies(updatedLobbies);
    
    if (lobbyId === currentLobby?.id) {
      setCurrentLobby(updatedLobby);
    }
  };

  const startGame = (lobbyId: string): void => {
    const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId);
    
    if (lobbyIndex === -1) {
      return;
    }
    
    const lobby = lobbies[lobbyIndex];
    
    // Choose a random player to go first
    const randomIndex = Math.floor(Math.random() * lobby.players.length);
    const firstPlayer = lobby.players[randomIndex];
    
    const updatedLobby = {
      ...lobby,
      gameStarted: true,
      firstPlayer
    };
    
    const updatedLobbies = [...lobbies];
    updatedLobbies[lobbyIndex] = updatedLobby;
    
    setLobbies(updatedLobbies);
    
    if (lobbyId === currentLobby?.id) {
      setCurrentLobby(updatedLobby);
    }
    
    toast.success(`Game started! ${firstPlayer.name} goes first.`);
  };

  const resetGame = (lobbyId: string): void => {
    const lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyId);
    
    if (lobbyIndex === -1) {
      return;
    }
    
    const lobby = lobbies[lobbyIndex];
    
    const updatedLobby = {
      ...lobby,
      gameStarted: false,
      firstPlayer: undefined
    };
    
    const updatedLobbies = [...lobbies];
    updatedLobbies[lobbyIndex] = updatedLobby;
    
    setLobbies(updatedLobbies);
    
    if (lobbyId === currentLobby?.id) {
      setCurrentLobby(updatedLobby);
    }
    
    toast.info("Game reset. Ready to start a new game.");
  };

  return (
    <LobbyContext.Provider
      value={{
        lobbies,
        currentLobby,
        currentPlayer,
        createLobby,
        joinLobby,
        getLobby,
        leaveLobby,
        toggleOptionalRole,
        startGame,
        resetGame
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
};

export const useLobby = () => {
  const context = useContext(LobbyContext);
  if (context === undefined) {
    throw new Error("useLobby must be used within a LobbyProvider");
  }
  return context;
};
