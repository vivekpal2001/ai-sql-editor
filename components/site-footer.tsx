'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Github, 
  Twitter, 
  LinkedinIcon, 
  Mail, 
  Heart, 
  Code, 
  Users, 
  Zap,
  ExternalLink
} from 'lucide-react'

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI SQL Editor</h3>
                <p className="text-xs text-muted-foreground">Database Learning Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bridging the gap between developers and database mastery with AI-powered tools, 
              interactive learning, and real-world practice environments.
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Open Source
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <nav className="space-y-3">
              <Link 
                href="/sql" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Database className="h-4 w-4 mr-2 group-hover:text-emerald-500 transition-colors" />
                SQL Editor
              </Link>
              <Link 
                href="#features" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Zap className="h-4 w-4 mr-2 group-hover:text-emerald-500 transition-colors" />
                Features
              </Link>
              <Link 
                href="/api/health" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Users className="h-4 w-4 mr-2 group-hover:text-emerald-500 transition-colors" />
                API Status
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <nav className="space-y-3">
              <a 
                href="https://www.postgresql.org/docs/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                PostgreSQL Docs
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a 
                href="https://dev.mysql.com/doc/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                MySQL Docs
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a 
                href="https://sql-tutorial.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                SQL Tutorial
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a 
                href="https://github.com/ai-sql-editor" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                GitHub Repository
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-emerald-500 transition-colors" />
              </a>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Join our community and stay updated with the latest features and database best practices.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <LinkedinIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Have questions? We'd love to help!
                </p>
                <a 
                  href="mailto:support@ai-sql-editor.com" 
                  className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  support@ai-sql-editor.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {currentYear} AI SQL Editor.</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for developers</span>
          </div>
        </div>

        {/* Tech Stack Credits */}
        <div className="mt-6 pt-4 border-t border-muted/50">
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <Badge variant="outline" className="text-xs">Next.js</Badge>
            <Badge variant="outline" className="text-xs">PostgreSQL</Badge>
            <Badge variant="outline" className="text-xs">MySQL</Badge>
            <Badge variant="outline" className="text-xs">Monaco Editor</Badge>
            <Badge variant="outline" className="text-xs">Gemini AI</Badge>
            <Badge variant="outline" className="text-xs">Docker</Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}
