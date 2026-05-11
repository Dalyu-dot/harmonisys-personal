'use client';

import type React from 'react';
import { footerLinks, headerLinks } from '@/constants';
import { handleSignOut } from '@/lib/action/user';
import { Button } from '@heroui/react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
  Badge,
  Chip,
  // Tooltip, // ✅ removed hover text
} from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { MhpssLevel, UserType } from '@prisma/client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'));
import {
  ChevronDownIcon,
  LogIn,
  MenuIcon,
  XIcon,
  LogOutIcon,
  ClipboardList,
  Waves,
  MapPinned,
  ShieldAlert,
  Phone,
  LayoutGrid,
  User,
  Home,
  Brain,
  Activity as ActivityIcon,
  UserCircle2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  session: Session | null;
}

const toolIconMap: Record<string, React.ReactNode> = {
  'Incident Reporting System': <ClipboardList className="w-4 h-4" />,
  REDAS: <Waves className="w-4 h-4" />,
  Unahon: <Brain className="w-4 h-4" />,
  'Mi Salud': <ActivityIcon className="w-4 h-4" />,
  HazardHunter: <MapPinned className="w-4 h-4" />,
};

const headerThemes: Record<string, string> = {
  irs: 'from-[#4A0A18] via-[#6B0F25] to-[#8B1538]',
  unahon: 'from-[#7A0C1E] via-[#991B1B] to-[#B91C1C]',
  misalud: 'from-emerald-800 via-emerald-700 to-emerald-600',
  hazardhunter: 'from-[#5A3A1A] via-[#7B5A3A] to-[#9D7C5A]',
  redas: 'from-blue-800 via-blue-700 to-sky-600',
  dashboard: 'from-[#5B0A0A] via-[#7A1111] to-[#A11B1B]',
  home: 'from-[#4A0707] via-[#6B0F0F] to-[#A11B1B]',
};

// Solid theme colors for user dropdown "Not assessed" + "Log Out"
const solidThemeByTool: Record<string, string> = {
  irs: '#7b122f',
  redas: '#1d43b9',
  unahon: '#84111d',
  misalud: '#06674b',
  hazardhunter: '#5a3a1a',
  home: '#4A0707',
  dashboard: '#5B0A0A',
};


// =======================
// Tool Dropdown Theme Map
// =======================

const toolDropdownBase: Record<string, string> = {
  home: '#77131e',
  irs: '#76112b',
  redas: '#1e4aca',
  unahon: '#90181f',
  misalud: '#077052',
  hazardhunter: '#5e3f1e',
};

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;

  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function mixWithWhite(hex: string, whiteMix: number) {
  const { r, g, b } = hexToRgb(hex);

  const rr = Math.round(r + (255 - r) * whiteMix);
  const gg = Math.round(g + (255 - g) * whiteMix);
  const bb = Math.round(b + (255 - b) * whiteMix);

  return `rgb(${rr} ${gg} ${bb})`;
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  const rr = Math.max(0, Math.round(r * (1 - amount)));
  const gg = Math.max(0, Math.round(g * (1 - amount)));
  const bb = Math.max(0, Math.round(b * (1 - amount)));

  return `rgb(${rr} ${gg} ${bb})`;
}

function makeToolDropdownTheme(baseHex: string) {
  return {
    accent: baseHex,
    iconBg: mixWithWhite(baseHex, 0.80),
    hoverBg: mixWithWhite(baseHex, 0.90),
  };
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isToolsExpanded, setToolsExpanded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

  const pathname = usePathname();

  const match =
    pathname?.match(/^\/overview\/([^/]+)/) ||
    pathname?.match(/^\/(misalud|irs|unahon|hazardhunter|redas)/);

  const activeTool =
    pathname?.startsWith('/incidents')
      ? 'irs'
      : match?.[1];

  const isDashboard = pathname === '/dashboard';
  const isHome = pathname === '/' || (!activeTool && !isDashboard);

  const headerGradient =
  
    (activeTool && headerThemes[activeTool]) ||
    (isDashboard && headerThemes.dashboard) ||
    headerThemes.home;

    // Solid theme color for "Not assessed" + "Log Out" (always matches per tool)
const solidThemeColor =
  (activeTool && solidThemeByTool[activeTool]) ||
  (isDashboard && solidThemeByTool.dashboard) ||
  solidThemeByTool.home;



  // Determine active dropdown theme
const themeKey =
  (activeTool && toolDropdownBase[activeTool]
    ? activeTool
    : isHome
    ? 'home'
    : 'home');

const toolTheme = makeToolDropdownTheme(
  toolDropdownBase[themeKey] || toolDropdownBase.home
);

const toolsCssVars = {
  ['--tool-accent' as any]: toolTheme.accent,
  ['--tool-icon-bg' as any]: toolTheme.iconBg,
  ['--tool-hover-bg' as any]: toolTheme.hoverBg,
} as React.CSSProperties;


  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  const getUserInitials = (name: string | null | undefined): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: UserType): string =>
  role.charAt(0).toUpperCase() + role.toLowerCase().slice(1);

    const formatRoleWithUser = (role: UserType): string =>
    `${formatRole(role)} User`;

    const getMhpssDisplay = (mhpssLevel: MhpssLevel | null | undefined): string => {
      if (!mhpssLevel) return 'Not assessed';
      return mhpssLevel.replace('LEVEL_', 'Level ');
    };

    const getMhpssColor = (
      mhpssLevel: MhpssLevel | null | undefined
    ): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
      if (mhpssLevel === MhpssLevel.LEVEL_1) return 'secondary';
      if (mhpssLevel === MhpssLevel.LEVEL_2) return 'success';
      if (mhpssLevel === MhpssLevel.LEVEL_3) return 'warning';
      if (mhpssLevel === MhpssLevel.LEVEL_4) return 'danger';
      return 'default';
    };

  const getRoleColor = (
    role: UserType
  ): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (role) {
      case UserType.ADMIN:
        return 'danger';
      case UserType.RESPONDER:
        return 'warning';
      case UserType.STANDARD:
        return 'success';
      default:
        return 'default';
    }
  };

  const navLinks = [
    { title: 'Home', url: '/', icon: <Home className="w-4 h-4 opacity-90" />, show: true },
    { title: 'Dashboard', url: '/dashboard', icon: <User className="w-4 h-4 opacity-90" />, show: !!session?.user },
    { title: 'Tools', url: '#', icon: <LayoutGrid className="w-4 h-4 opacity-90" />, show: true },
    { title: 'Contact', url: '/contact', icon: <Phone className="w-4 h-4 opacity-90" />, show: true },
  ];

  return (
    <header
      className={`
        sticky top-0 z-50
        relative overflow-hidden
        bg-gradient-to-r ${headerGradient}
        text-white
        shadow-2xl shadow-black/45
        border-b border-white/10 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-white/15
        backdrop-blur-md bg-opacity-95
      `}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle at 0 0,
              rgba(255,255,255,0.15),
              rgba(255,255,255,0.15) 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 4px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.25),
              transparent 60%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Button
                as={Link}
                href="/"
                variant="light"
                // ✅ removed click highlight
                className="font-bold text-lg tracking-wide text-white hover:!bg-white/10 active:!bg-transparent transition-colors duration-200 py-1 px-2"
                startContent={
                <Image
                    src="/Logo 1.png"
                    alt="Harmonisys Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                }

              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-black text-sm sm:text-base">HARMONISYS.PH</span>
                  <span className="text-xs opacity-80 font-normal hidden sm:block">DRRM Platform</span>
                </div>
              </Button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks
                .filter((link) => !(link.title === 'Dashboard' && !session?.user) && link.show)
                .map((link, idx, arr) => {
                  const isTools = link.title === 'Tools';

                  return (
                    <div key={link.title} className="flex items-center">
                      {isTools ? (
                        <Dropdown placement="bottom-start">
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              // ✅ removed click highlight
                              className="text-white hover:!bg-white/10 active:!bg-transparent
                                data-[pressed=true]:!bg-transparent data-[focus-visible=true]:!bg-transparent
                                transition-all duration-200 flex items-center gap-2 px-3 rounded-xl"

                              endContent={<ChevronDownIcon className="w-4 h-4" />}
                            >
                              {link.icon}
                              <span>{link.title}</span>
                            </Button>
                          </DropdownTrigger>

                          <DropdownMenu
  aria-label="Tools menu"
  style={toolsCssVars}
  className="min-w-[280px] p-2 bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl"
>

                            {/* ✅ removed Quick Links section */}
                            <DropdownSection title="DRRM Tools">
                              {footerLinks[1].links.map((item) => {
                                const icon = toolIconMap[item.title] ?? <ShieldAlert className="w-4 h-4" />;

                                return (
                                  <DropdownItem
                                    key={item.title}
                                    as={Link}
                                    href={item.url}
                                    aria-label={item.title}
                                    className="
                                      text-gray-900 py-3
                                      data-[hover=true]:bg-[color:var(--tool-hover-bg)]
                                      data-[hover=true]:text-[color:var(--tool-accent)]
                                    "

                                                                        startContent={
                                                                          <div
                                      className="p-2 rounded-lg"
                                      style={{ backgroundColor: 'var(--tool-icon-bg)' }}
                                    >
                                      <span style={{ color: 'var(--tool-accent)' }}>
                                        {icon}
                                      </span>
                                    </div>

                                    }
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{item.title}</span>
                                      <span className="text-xs text-gray-500 mt-1">
                                        {item.title === 'Incident Reporting System' && 'Real-time incident reporting'}
                                        {item.title === 'REDAS' && 'Earthquake hazard assessment'}
                                        {item.title === 'Unahon' && 'Mental health screening'}
                                        {item.title === 'Mi Salud' && 'Responder wellness tracking'}
                                        {item.title === 'HazardHunter' && 'Location-based hazard assessment'}
                                      </span>
                                    </div>
                                  </DropdownItem>
                                );
                              })}
                            </DropdownSection>
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        // ✅ Tooltip removed
                        <Button
                          as={Link}
                          href={link.url}
                          variant="light"
                          // ✅ removed click highlight
                          className={`text-white hover:!bg-white/10 active:!bg-transparent
                            data-[pressed=true]:!bg-transparent data-[focus-visible=true]:!bg-transparent
                            transition-all duration-200 flex items-center gap-2 px-3 rounded-xl ${
                            ((link.title === 'Home' && isHome) ||
                                (link.title === 'Dashboard' && isDashboard))
                                ? 'underline underline-offset-8 decoration-white/70 decoration-2'
                                : ''
                            }`}

                          startContent={link.icon}
                        >
                          <span className="hidden sm:inline">{link.title}</span>
                        </Button>
                      )}

                      {idx < arr.length - 1 && (
                        <span className="mx-1 text-white/50 select-none">|</span>
                      )}

                    </div>
                  );
                })}
            </nav>

            {/* ✅ Improved User Section */}
            <div className="flex items-center space-x-2">
              {session?.user ? (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      // ✅ removed click highlight
                      className="flex items-center gap-3 px-3 py-2.5 text-white rounded-2xl
                        hover:!bg-white/10 active:!bg-transparent
                        data-[pressed=true]:!bg-transparent data-[focus-visible=true]:!bg-transparent
                        border border-white/10 bg-white/5
                        min-h-[52px]"




                      aria-label={`User menu for ${session.user.name}`}
                    >
                      <Badge
                        content=""
                        color="success"
                        shape="circle"
                        placement="bottom-right"
                        size="sm"
                      >
                        <Avatar
                          src={session.user.image || undefined}
                          name={getUserInitials(session.user.name)}
                          size="sm"
                          className="bg-gradient-to-br from-red-400 to-purple-500 text-white ring-2 ring-white/20"
                        />
                      </Badge>

                      <div className="hidden lg:flex flex-col items-start max-w-[220px] leading-tight shrink-0">
                        <span className="text-sm font-semibold truncate text-white">
                            {session.user.name || 'User'}
                        </span>

                        <span
                            className="
                            mt-0.3 inline-flex items-center
                            rounded-full px-3 py-[3px]
                            text-[12px] font-medium
                            bg-[#2A060D]/45 border border-white/10
                            text-white/90
                            whitespace-nowrap

                            "
                        >
                            {formatRoleWithUser(session.user.role)}
                        </span>
                        </div>



                      <ChevronDownIcon className="w-4 h-4 opacity-90" />
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="User menu"
                    className="min-w-[340px] p-0 bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200 rounded-2xl overflow-hidden"
                    closeOnSelect={false}
                    selectionMode="none"
                  >
                    <DropdownItem key="profile" className="h-auto p-0" textValue="User profile information">
                      {/* Header strip */}
                      <div className={`px-5 pt-4 pb-4 bg-gradient-to-r ${headerGradient}`}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={session.user.image || undefined}
                            name={getUserInitials(session.user.name)}
                            size="md"
                            className="bg-gradient-to-br from-red-400 to-purple-500 text-white ring-2 ring-white/30"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white leading-tight truncate">
                              {session.user.name || 'User'}
                            </div>
                            <div className="text-xs text-white/80 truncate">
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-4 bg-white">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold
                            bg-gradient-to-r ${headerGradient} text-white border border-white/15`}
                          >
                            <UserCircle2 className="w-4 h-4 opacity-90" />
                            {formatRoleWithUser(session.user.role)}
                          </span>

                          <span
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold bg-white"
                            style={{
                              color: solidThemeColor,
                              border: `1px solid ${solidThemeColor}40`,
                            }}
                          >
                            <ShieldAlert className="w-4 h-4 opacity-80" />
                              {getMhpssDisplay(session.user.mhpssLevel)}
                          </span>
                        </div>
                      </div>
                    </DropdownItem>

                    <DropdownItem
                      key="divider"
                      isDisabled
                      textValue="divider"
                      className="h-px p-0 my-0 bg-gray-200 cursor-default"
                    />

                    <DropdownItem
                      key="signout"
                      className="
                        px-5 pb-5 pt-4
                        data-[hover=true]:bg-transparent
                        cursor-default
                      "
                      textValue="Log out"
                      closeOnSelect={true}
                    >
                      <button
                        type="button"
                        className="
                          w-full flex items-center justify-center gap-2
                          rounded-xl text-white
                          transition-colors
                          py-3 font-semibold
                          focus:outline-none
                        "
                        style={{ backgroundColor: solidThemeColor }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            mixWithWhite(solidThemeColor, 0.10);
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            solidThemeColor;
                        }}
                        onClick={() => handleSignOut()}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Log Out
                      </button>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Button
                  type="button"
                  variant="solid"
                  size="md"
                  onPress={() => {
                    setAuthModalView('login');
                    setIsAuthModalOpen(true);
                  }}
                  startContent={
                    <LogIn className="w-4 h-4 text-[#5B0A0A]" />
                  }
                  className="
                    px-5 py-2.5 rounded-xl
                    font-semibold

                    bg-white text-gray-900

                    border border-[#5B0A0A]/20
                    shadow-md shadow-black/20

                    hover:shadow-lg hover:scale-[1.03]
                    hover:bg-white hover:border-red-200

                    transition-all duration-300 ease-out
                  "
                >
                  <span className="hidden sm:inline bg-gradient-to-r from-[#7A0C1E] via-[#5B0A0A] to-[#3B0505] bg-clip-text text-transparent">
                    Log In
                  </span>
                  <span className="sm:hidden bg-gradient-to-r from-[#7A0C1E] via-[#5B0A0A] to-[#3B0505] bg-clip-text text-transparent">
                    Sign In
                  </span>
                </Button>
              )}

              {/* Mobile Toggle */}
              <div className="md:hidden">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                  // ✅ removed click highlight
                  className="text-white hover:bg-black/20 active:bg-transparent"
                >
                  {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (kept functionally same) */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {session?.user && (
          <div className="bg-red-50 p-4 border-b border-red-200">
            <div className="flex items-center gap-3">
              <Avatar
                src={session.user.image || undefined}
                name={getUserInitials(session.user.name)}
                size="md"
                className="bg-gradient-to-br from-red-400 to-purple-500 text-white"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{session.user.name || 'User'}</div>
                <div className="flex gap-2 mt-1">
                  <Chip size="sm" color={getRoleColor(session.user.role)} variant="flat">
                    {formatRole(session.user.role)}
                  </Chip>
                    <Chip size="sm" color={getMhpssColor(session.user.mhpssLevel)} variant="flat">
                      {getMhpssDisplay(session.user.mhpssLevel)}
                    </Chip>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="py-2">
          {navLinks.map((link) => {
            if (link.title === 'Dashboard' && !session?.user) return null;

            return link.title === 'Tools' ? (
              <div key={link.title}>
                <Button
                  onPress={() => setToolsExpanded(!isToolsExpanded)}
                  variant="light"
                  className="w-full justify-between px-4 py-3 text-gray-900 hover:bg-red-50 hover:text-red-900 rounded-none"
                  startContent={link.icon}
                  endContent={
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${isToolsExpanded ? 'rotate-180' : ''}`}
                    />
                  }
                >
                  {link.title}
                </Button>

                <div
  style={toolsCssVars}
  className={`bg-[color:var(--tool-hover-bg)] transition-all duration-300 ease-in-out ${


                    isToolsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  {footerLinks[1].links.map((item) => (
                    <Button
                      key={item.title}
                      as={Link}
                      href={item.url}
                      variant="light"
                      className="w-full justify-start px-8 py-3 text-gray-700 hover:bg-[color:var(--tool-hover-bg)]
hover:text-[color:var(--tool-accent)]
 rounded-none border-b border-gray-100"
                      onPress={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div
  className="p-2 rounded-lg"
  style={{ backgroundColor: 'var(--tool-icon-bg)' }}
>

                          {toolIconMap[item.title] || <ShieldAlert className="w-4 h-4 text-red-700" />}
                        </div>
                        <span>{item.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <Button
                key={link.title}
                as={Link}
                href={link.url}
                variant="light"
                startContent={link.icon}
                className={`w-full justify-start px-4 py-3 text-gray-900 hover:bg-red-50 hover:text-red-900 rounded-none ${
                  ((link.title === 'Home' && isHome) || (link.title === 'Dashboard' && isDashboard))
                    ? 'bg-red-50 text-red-900'
                    : ''
                }`}
                onPress={() => setMobileMenuOpen(false)}
              >
                {link.title}
              </Button>
            );
          })}
        </div>

        {session?.user && (
          <div className="border-t border-red-200 bg-red-50 p-4">
            <Button
              variant="light"
              className="w-full justify-start text-red-600 hover:bg-red-100 active:!bg-transparent"
              startContent={<LogOutIcon className="w-4 h-4" />}
              onPress={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        )}
            </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultView={authModalView}
      />
    </header>
  );
};

export default Header;
