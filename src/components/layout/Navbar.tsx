
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut,
  Settings,
  User,
  MessageCircle,
  BriefcaseIcon
} from "lucide-react";

const Navbar = ({ isAuthenticated = false, userProfile = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Will handle logout logic after Supabase integration
    navigate("/login");
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-cobrew-600">Co-Brew</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Projects
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Messages
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => navigate("/projects/new")} 
                  className="bg-cobrew-600 hover:bg-cobrew-700"
                >
                  Create Project
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={userProfile?.avatarUrl} />
                      <AvatarFallback className="bg-cobrew-500 text-white">
                        {getInitials(userProfile?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userProfile?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{userProfile?.email || ""}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <BriefcaseIcon className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-cobrew-600 hover:bg-cobrew-700"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cobrew-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-cobrew-500 text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-gray-300 text-base font-medium"
            >
              Projects
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-gray-300 text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-gray-300 text-base font-medium"
                >
                  Messages
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatarUrl} />
                      <AvatarFallback className="bg-cobrew-500 text-white">
                        {getInitials(userProfile?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {userProfile?.name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {userProfile?.email || ""}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-center mb-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  className="w-full justify-center bg-cobrew-600 hover:bg-cobrew-700"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
