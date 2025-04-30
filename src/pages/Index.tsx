
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Gamepad, Users, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <Layout background="parchment">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-quest-royal-purple medieval-heading mb-4">
              Quest Lobby Launcher
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Welcome to the ultimate companion app for Quest by Don Eskridge
            </p>
            <p className="text-gray-600 italic">
              Create or join game lobbies, select optional roles, and easily set up your Quest games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="border-quest-gold bg-quest-parchment/90 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center">
                <Gamepad size={48} className="text-quest-royal-purple mb-4" />
                <h2 className="text-2xl font-bold text-quest-royal-purple medieval-heading mb-2">Create a Lobby</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Host a new game and invite friends to join your quest
                </p>
                <Button 
                  asChild 
                  className="bg-quest-royal-purple hover:bg-quest-light-purple quest-button"
                  size="lg"
                >
                  <Link to="/create-lobby">Create Lobby</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-quest-gold bg-quest-parchment/90 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center">
                <Users size={48} className="text-quest-royal-purple mb-4" />
                <h2 className="text-2xl font-bold text-quest-royal-purple medieval-heading mb-2">Join a Lobby</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Enter an existing game and join friends on their quest
                </p>
                <Button 
                  asChild 
                  className="bg-quest-royal-purple hover:bg-quest-light-purple quest-button"
                  size="lg"
                >
                  <Link to="/join-lobby">Join Lobby</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-quest-royal-purple rounded-lg p-6 text-white max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
              <Play size={24} className="mr-2 text-quest-gold" />
              How to Use
            </h3>
            <ol className="text-left space-y-2 list-decimal pl-6">
              <li>Create a new game lobby or join an existing one with an invite code</li>
              <li>Enter your screen name to join the lobby</li>
              <li>If you're the host, select which optional roles to include</li>
              <li>Start the game when everyone has joined</li>
              <li>The app will determine the required cards and randomly select the first player</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
