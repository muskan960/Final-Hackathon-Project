import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users, X } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/remove-background', label: 'RemoveBackground', Icon: Eraser },
  { to: '/ai/remove-object', label: 'RemoveObject', Icon: Scissors },
  { to: '/ai/review-resume', label: 'ReviewResume', Icon: FileText },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
<div
  className={`
    w-60 bg-white border-r border-gray-200
    flex flex-col justify-between items-center max-sm:absolute
   top-14 bottom-0 
    
    ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out
   
  `}
>
  {/* TOP SCROLLABLE CONTENT */}
  <div className="my-7 mt-10 w-full">
    <img
      src={user.imageUrl}
      alt="user avatar"
      className="w-13 rounded-full mx-auto cursor-pointer"
    />
    <h1 className="mt-2 text-center cursor-pointer">{user.fullName}</h1>

    <div className="mt-10 px-6 text-sm text-gray-600 font-medium">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/ai'}
          onClick={() => setSidebar(false)}
          className={({ isActive }) =>
            `px-3.5 py-2.5 flex items-center gap-3 rounded-full ${
              isActive
                ? 'bg-gradient-to-r from-[#4a86ee] to-[#9950de] text-white'
                : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>

  {/* BOTTOM PROFILE */}
  <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between ">
    <div
      onClick={openUserProfile}
      className="flex gap-2 items-center cursor-pointer"
    >
      <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
      <div>
        <h1 className="text-sm font-medium">{user.fullName}</h1>
        <p className="text-xs text-gray-500">
          <Protect plan="premium" fallback="Free">Premium</Protect> Plan
        </p>
      </div>
    </div>

    <LogOut
      onClick={signOut}
      className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
    />
  </div>
</div>

  );
};

export default Sidebar;
