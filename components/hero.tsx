'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ShieldCheck, Cpu, Database, GraduationCap, Code, Zap, Users } from 'lucide-react'

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.15),rgba(0,0,0,0))]" />
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-emerald-700 bg-emerald-50 border-emerald-200 w-fit">
            Test query in real time and database 
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Skip the Setup, Jump to the Query
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your e-commerce site, social app, or any project idea. Our AI builds the schema and fills it with smart test data so you can start querying immediately.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sql">
              <Button size="lg" className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600">
                <span>Start Building</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">
                Explore Features
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-emerald-500" />
              <span>Student-Friendly Learning</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code className="h-4 w-4 text-emerald-500" />
              <span>Developer-Ready Tools</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-emerald-500" />
              <span>Industry-Standard Practice</span>
            </div>
          </div>
        </div>
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Floating Database Visualization */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative z-10 p-8 bg-white/80 backdrop-blur rounded-2xl border shadow-2xl">
              <div className="text-center space-y-4">
                <Database className="h-16 w-16 text-emerald-500 mx-auto animate-pulse" />
                <h3 className="text-xl font-semibold">AI-Powered Database</h3>
                <p className="text-sm text-muted-foreground">Generate schemas instantly with intelligent data</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block">
            <div className="rounded-xl border bg-white/80 backdrop-blur shadow p-4">
              <div className="text-sm font-medium">Interactive Learning</div>
              <div className="text-xs text-muted-foreground">Real-time database interaction</div>
            </div>
          </div>
        </div>
      </div>
      <FeatureSection />
    </section>
  )
}

function FeatureSection() {
  const [featuresVisible, setFeaturesVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('features')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div id="features" className="max-w-[1200px] mx-auto px-4 pb-16">
      <div className={`text-center mb-12 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Bridging the Skills Gap in Database Development
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our platform addresses the critical shortage of database skills in the tech industry by providing 
          an intuitive, AI-powered learning and development environment that scales from beginner to expert level.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard 
          icon={<GraduationCap className="h-6 w-6" />}
          title="Student Empowerment" 
          desc="Transform complex database concepts into interactive, hands-on learning experiences with real-time feedback and AI guidance." 
          delay="delay-200"
          isVisible={featuresVisible}
        />
        <FeatureCard 
          icon={<Code className="h-6 w-6" />}
          title="Developer Acceleration" 
          desc="Streamline database design and prototyping with intelligent schema generation, reducing development time from days to minutes." 
          delay="delay-400"
          isVisible={featuresVisible}
        />
        <FeatureCard 
          icon={<Database className="h-6 w-6" />}
          title="Industry Bridge" 
          desc="Connect academic learning with real-world database practices using production-grade tools and industry-standard workflows." 
          delay="delay-600"
          isVisible={featuresVisible}
        />
      </div>
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border transition-all duration-1000 delay-800 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">The Database Skills Crisis</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>• 73% of companies report difficulty finding qualified database developers</p>
              <p>• Students graduate with theoretical knowledge but lack practical experience</p>
              <p>• Traditional database learning tools are outdated and disconnected from modern workflows</p>
              <p>• AI revolution requires new approaches to data management education</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>• AI-powered schema generation and optimization</p>
              <p>• Interactive learning with real database environments</p>
              <p>• Seamless transition from education to production</p>
              <p>• Modern tech stack aligned with industry demands</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, desc, icon, delay, isVisible }: { 
  title: string; 
  desc: string; 
  icon: React.ReactNode; 
  delay: string;
  isVisible: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white/70 backdrop-blur p-6 hover:shadow-lg transition-all hover:scale-105 duration-1000 ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
          {icon}
        </div>
        <div className="text-lg font-medium">{title}</div>
      </div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  )
}
