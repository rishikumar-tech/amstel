import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Phone } from 'lucide-react';

const BottomNav = () => {
    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Shop', path: '/shop', icon: ShoppingBag },
        { name: 'My Bag', path: '/cart', icon: ShoppingBag },
        { name: 'Contact', path: '/contact', icon: Phone },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/5 py-3 px-6 z-50">
            <div className="flex items-center justify-between">
                {navLinks.map((link) => (
                    <NavLink 
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 transition-all duration-300
                            ${isActive ? 'text-secondary scale-110' : 'text-white/50 hover:text-white'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={22} className={isActive ? 'fill-secondary' : ''} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">{link.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
