
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateLobby from "./pages/CreateLobby";
import JoinLobby from "./pages/JoinLobby";
import Lobby from "./pages/Lobby";
import GameSetup from "./pages/GameSetup";
import NotFound from "./pages/NotFound";
import { LobbyProvider } from "./contexts/LobbyContext";

const queryClient = new QueryClient();

// Get the base URL from the environment or default to '/'
const basename = import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LobbyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-lobby" element={<CreateLobby />} />
            <Route path="/join-lobby" element={<JoinLobby />} />
            <Route path="/lobby/:lobbyId" element={<Lobby />} />
            <Route path="/game-setup/:lobbyId" element={<GameSetup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LobbyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
