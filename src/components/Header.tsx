
import { Link } from "react-router-dom";
import { Gamepad } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-quest-royal-purple text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad size={24} className="text-quest-gold" />
          <h1 className="text-xl md:text-2xl font-bold medieval-heading">Quest Lobby Launcher</h1>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-quest-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create-lobby" className="hover:text-quest-gold transition-colors">
                Create Lobby
              </Link>
            </li>
            <li>
              <Link to="/join-lobby" className="hover:text-quest-gold transition-colors">
                Join Lobby
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
