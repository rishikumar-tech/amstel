import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MapPin, Phone, RefreshCw, Lock, FileText, Mail, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Brand SVG Icons (WhatsApp / Instagram / YouTube / Facebook) ────────────────────────

const WhatsAppIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const FacebookIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 10-11.5 9.87v-6.99H8.08V12h2.42V9.8c0-2.4 1.43-3.73 3.62-3.73 1.05 0 2.15.19 2.15.19v2.36h-1.21c-1.2 0-1.57.75-1.57 1.52V12h2.67l-.43 2.88h-2.24v6.99A10 10 0 0022 12z" />
    </svg>
);

const InstagramIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
);

const YouTubeIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const policies = [
    { label: 'Refund Policy',      href: '/policies/refund',   Icon: RefreshCw },
    { label: 'Privacy Policy',     href: '/policies/privacy',  Icon: Lock },
    { label: 'Terms of Service',   href: '/policies/terms',    Icon: FileText },
    { label: 'Contact Info',       href: '/contact',           Icon: Mail },
    { label: 'Shipping Policy',    href: '/policies/shipping', Icon: Truck },
];

const socialLinks = [
    {
        label: 'WhatsApp',
        href: 'https://wa.me/917868844044',
        Icon: WhatsAppIcon,
        hoverColor: 'hover:text-green-400',
        hoverBg: 'hover:bg-green-500/10 hover:border-green-500/30',
    },
    {
        label: 'Facebook',
        href:'https://www.facebook.com/amstelrider',
        Icon: FacebookIcon,
        hoverColor: 'hover:text-blue-400',
        hoverBg: 'hover:bg-blue-500/10 hover:border-blue-500/30',
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/amstel_riders_vellore',
        Icon: InstagramIcon,
        hoverColor: 'hover:text-pink-400',
        hoverBg: 'hover:bg-pink-500/10 hover:border-pink-500/30',
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@amstel_riders_vellore',
        Icon: YouTubeIcon,
        hoverColor: 'hover:text-red-500',
        hoverBg: 'hover:bg-red-500/10 hover:border-red-500/30',
    },
];

// ─── Minimal Footer (Contact Page Only) ───────────────────────────────────────

export const MinimalFooter = () => (
    <footer
        className="border-t border-white/5 mt-auto pt-10 pb-28 md:pb-12 px-6"
        aria-label="Minimal site footer"
    >
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-8">
            {/* Social Icons */}
            <div className="flex items-center gap-3" aria-label="Social media links">
                {socialLinks.map(({ label, href, Icon, hoverColor, hoverBg }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${label}`}
                        className={`
                            w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center
                            text-white/40 transition-all duration-300
                            ${hoverColor} ${hoverBg}
                        `}
                    >
                        <Icon size={18} />
                    </a>
                ))}
            </div>

            {/* Policy Links */}
            <nav aria-label="Policy links" className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2">
                {policies.map(({ label, href }) => (
                    <NavLink
                        key={label}
                        to={href}
                        className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-secondary transition-all duration-300 italic relative group"
                    >
                        {label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-secondary group-hover:w-full transition-all duration-300" />
                    </NavLink>
                ))}
            </nav>
        </div>
    </footer>
);

// ─── Full Footer (All Pages Except Contact) ───────────────────────────────────

export const FullFooter = () => (
    <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="border-t border-white/5 bg-[#0a0a0a] pb-28 md:pb-0"
        aria-label="Site footer"
    >
        {/* Top accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-secondary to-transparent opacity-30" />

        <div className="container mx-auto px-6 md:px-12 max-w-7xl py-16 md:py-20">
            {/* ─── Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                {/* Brand Column */}
                <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-6">
                    <NavLink to="/" className="flex items-center gap-3" aria-label="Amstel Riders Home">
                        <img
                            src="/AR LOGO.png"
                            alt="Amstel Riders Logo"
                            className="w-12 h-12 object-contain"
                            loading="lazy"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-2xl font-black italic tracking-tighter text-white">AMSTEL</span>
                            <span className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">RIDERS HELMETS</span>
                        </div>
                    </NavLink>
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest italic leading-relaxed max-w-xs">
                        Premium motorcycle helmets & riding gear. Fast shipping. Verified quality.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3 pt-2" aria-label="Social media links">
                        {socialLinks.map(({ label, href, Icon, hoverColor, hoverBg }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Follow Amstel Riders on ${label}`}
                                className={`
                                    w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center
                                    text-white/40 transition-all duration-300 group
                                    ${hoverColor} ${hoverBg}
                                `}
                            >
                                <span className="transition-transform duration-300 group-hover:scale-110">
                                    <Icon size={18} />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Delivery & Returns */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 italic border-b border-white/5 pb-3">
                        Delivery &amp; Returns
                    </h3>
                    <nav aria-label="Delivery and returns policies" className="flex flex-col gap-3">
                        {policies.map(({ label, href, Icon }) => (
                            <NavLink
                                key={label}
                                to={href}
                                className="group flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all duration-300 italic w-fit"
                            >
                                <Icon size={12} className="text-secondary/60 group-hover:text-secondary transition-colors duration-300 flex-shrink-0" />
                                <span className="relative">
                                    {label}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-secondary group-hover:w-full transition-all duration-300" />
                                </span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 italic border-b border-white/5 pb-3">
                        Navigate
                    </h3>
                    <nav aria-label="Site navigation links" className="flex flex-col gap-3">
                        {[
                            { label: 'Home',    href: '/'       },
                            { label: 'Shop',    href: '/shop'   },
                            { label: 'Cart',    href: '/cart'   },
                            { label: 'Contact', href: '/contact'},
                        ].map(({ label, href }) => (
                            <NavLink
                                key={label}
                                to={href}
                                className="group text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all duration-300 italic w-fit relative"
                            >
                                {label}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Business Info */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 italic border-b border-white/5 pb-3">
                        Gear Hub
                    </h3>
                    <address className="not-italic flex flex-col gap-4">
                        <div className="flex items-start gap-3 group">
                            <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/30 transition-colors duration-300">
                                <MapPin size={13} className="text-secondary/60 group-hover:text-secondary transition-colors duration-300" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-white/30 italic leading-relaxed">
                                Amstel Riders Helmets<br />
                                Vellore – Katpadi Road,<br />
                                Near New Bus Stand,<br />
                                Vellore, Tamil Nadu 632004
                            </p>
                        </div>

                        <a
                            href="tel:+917868844044"
                            className="flex items-center gap-3 group w-fit"
                            aria-label="Call Amstel Riders"
                        >
                            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/30 transition-colors duration-300">
                                <Phone size={13} className="text-secondary/60 group-hover:text-secondary transition-colors duration-300" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-colors duration-300 italic">
                                +91 78688 44044
                            </span>
                        </a>
                    </address>
                </div>
            </div>

            {/* ─── Bottom Bar ─────────────────────────────────────────── */}
            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic text-center sm:text-left">
                    © 2026 Amstel Riders. All rights reserved.
                </p>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/10 italic text-center sm:text-right">
                    Crafted for Riders &bull; Vellore, India
                </p>
            </div>
        </div>
    </motion.footer>
);

// ─── Smart Footer (auto-selects variant) ──────────────────────────────────────

const Footer = () => {
    const { pathname } = useLocation();
    const isContactPage = pathname === '/contact';

    return isContactPage ? <MinimalFooter /> : <FullFooter />;
};

export default Footer;
