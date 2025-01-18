'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, FileText, Bot, Menu, X, Briefcase, GraduationCap, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isOp2unityOpen, setIsOp2unityOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const headerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsToolsOpen(false)
        setIsOp2unityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  const tools = [
    {
      name: 'QRcode Gen',
      icon: QrCode,
      href: '/tools/qrcode',
      description: 'Generate QR codes easily'
    },
    {
      name: 'File Converter',
      icon: FileText,
      href: '/tools/converter',
      description: 'Convert files between formats'
    },
    {
      name: 'AI Mock Interview',
      icon: Bot,
      href: '/dashboard',
      description: 'Practice with AI interviewer'
    }
  ]

  const opportunities = [
    {
      name: 'Job Board',
      icon: Briefcase,
      href: '/opportunities/jobs',
      description: 'Find your next role'
    },
    {
      name: 'Learning Path',
      icon: GraduationCap,
      href: '/opportunities/learn',
      description: 'Grow your skills'
    },
    {
      name: 'Community',
      icon: Users,
      href: '/opportunities/community',
      description: 'Connect with others'
    }
  ]

  return (
    (<header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'
      )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8ABIEyx7YChsbV6EGDrCU0ga8enwAs.png"
              alt="Qudmeet Logo"
              width={40}
              height={40}
              className="rounded-full" />
            <span className="text-xl font-bold">Qudmeet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => {
                  setIsToolsOpen(!isToolsOpen)
                  setIsOp2unityOpen(false)
                }}
                onMouseEnter={() => {
                  setIsToolsOpen(true)
                  setIsOp2unityOpen(false)
                }}
                className={cn(
                  'px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors',
                  isToolsOpen && 'bg-gray-100'
                )}>
                Tools
              </button>
              <AnimatePresence>
                {isToolsOpen && <DropdownMenu items={tools} onClose={() => setIsToolsOpen(false)} />}
              </AnimatePresence>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link
              href="/sponsor"
              className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Sponsor Us
            </Link>
            <div className="relative">
              <button
                onClick={() => {
                  setIsOp2unityOpen(!isOp2unityOpen)
                  setIsToolsOpen(false)
                }}
                onMouseEnter={() => {
                  setIsOp2unityOpen(true)
                  setIsToolsOpen(false)
                }}
                className={cn(
                  'px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors',
                  isOp2unityOpen && 'bg-gray-100'
                )}>
                Op2unity
              </button>
              <AnimatePresence>
                {isOp2unityOpen && <DropdownMenu items={opportunities} onClose={() => setIsOp2unityOpen(false)} />}
              </AnimatePresence>
            </div>
            <Button variant="default" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="space-y-1">
                  <button
                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Tools
                  </button>
                  {isToolsOpen && (
                    <div className="pl-4 space-y-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
                          <tool.icon className="w-5 h-5 mr-2" />
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  About
                </Link>
                <Link
                  href="/sponsor"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  Sponsor Us
                </Link>
                <div className="space-y-1">
                  <button
                    onClick={() => setIsOp2unityOpen(!isOp2unityOpen)}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Op2unity
                  </button>
                  {isOp2unityOpen && (
                    <div className="pl-4 space-y-1">
                      {opportunities.map((opportunity) => (
                        <Link
                          key={opportunity.name}
                          href={opportunity.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
                          <opportunity.icon className="w-5 h-5 mr-2" />
                          {opportunity.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Button variant="default" className="w-full" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>)
  );
}

function DropdownMenu({
  items,
  onClose
}) {
  return (
    (<motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onMouseLeave={onClose}
      className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
      style={{ width: '500px', marginLeft: '-200px' }}>
      <div
        className="bg-white rounded-[40px] shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="relative bg-blue-50/50 rounded-[40px]">
          <div className="grid grid-cols-3 gap-4 p-8">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-blue-100/50 transition-colors">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>)
  );
}

