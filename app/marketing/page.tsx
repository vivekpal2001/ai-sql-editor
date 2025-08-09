import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnimatedTechStack } from '@/components/animated-tech-stack'
import { 
  ArrowRight, 
  Database, 
  Brain, 
  Users, 
  Zap, 
  GraduationCap, 
  Code, 
  Rocket,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.15),rgba(0,0,0,0))]" />
        <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="rounded-full px-4 py-2 text-emerald-700 bg-emerald-50 border-emerald-200 mb-6">
            🚀 Revolutionizing Database Education
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            The Future of Database Learning
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            An AI-powered platform that bridges the critical gap between academic database theory 
            and real-world development skills, empowering the next generation of data professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/sql">
              <Button size="lg" className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600">
                <span>Start Learning</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <BookOpen className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
          <div className="max-w-4xl mx-auto">
            <AnimatedTechStack />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-red-600 dark:text-red-400">The Database Skills Crisis</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The tech industry faces a critical shortage of qualified database professionals, 
              while traditional education fails to bridge theory with practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              number="73%" 
              label="Companies struggling to find qualified database developers"
              color="text-red-600"
            />
            <StatCard 
              number="84%" 
              label="Students report feeling unprepared for real-world database work"
              color="text-orange-600"
            />
            <StatCard 
              number="2.5M" 
              label="Unfilled data-related jobs projected by 2025"
              color="text-red-600"
            />
            <StatCard 
              number="65%" 
              label="Bootcamp graduates lack hands-on database experience"
              color="text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Revolutionary Solution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're transforming database education with AI-powered tools that provide 
              real-world experience in a safe, guided learning environment.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI-Powered Learning"
              description="Intelligent schema generation, query optimization suggestions, and personalized learning paths powered by cutting-edge AI technology."
              benefits={[
                "Smart schema recommendations",
                "Automated code review",
                "Personalized curriculum",
                "Real-time assistance"
              ]}
            />
            <FeatureCard
              icon={<Database className="h-8 w-8" />}
              title="Production-Ready Environment"
              description="Work with real PostgreSQL and MySQL databases in containerized environments that mirror industry standards."
              benefits={[
                "Docker-based isolation",
                "Multiple database engines",
                "Scalable architecture",
                "Industry best practices"
              ]}
            />
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8" />}
              title="Progressive Learning Path"
              description="From basic concepts to advanced optimization, our curriculum adapts to your skill level and learning pace."
              benefits={[
                "Beginner to expert progression",
                "Hands-on projects",
                "Real-world scenarios",
                "Immediate feedback"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Market Impact */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Transforming the Industry</h2>
              <p className="text-lg text-muted-foreground mb-8">
                By providing accessible, practical database education, we're not just teaching skills—
                we're building the foundation for the next generation of data-driven applications and AI systems.
              </p>
              <div className="space-y-4">
                <ImpactPoint 
                  icon={<Users className="h-5 w-5" />}
                  text="Democratizing database education for students worldwide"
                />
                <ImpactPoint 
                  icon={<Rocket className="h-5 w-5" />}
                  text="Accelerating developer productivity with AI-assisted tools"
                />
                <ImpactPoint 
                  icon={<TrendingUp className="h-5 w-5" />}
                  text="Reducing time-to-market for database-driven applications"
                />
                <ImpactPoint 
                  icon={<Lightbulb className="h-5 w-5" />}
                  text="Fostering innovation in data architecture and design"
                />
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-white/70 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    For Students
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Transform theoretical knowledge into practical skills</p>
                  <p className="text-sm text-muted-foreground">Build portfolio-worthy database projects</p>
                  <p className="text-sm text-muted-foreground">Gain confidence in real-world scenarios</p>
                </CardContent>
              </Card>
              <Card className="p-6 bg-white/70 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-teal-600" />
                    For Developers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Rapid prototyping and schema iteration</p>
                  <p className="text-sm text-muted-foreground">AI-powered optimization suggestions</p>
                  <p className="text-sm text-muted-foreground">Streamlined development workflow</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Database Skills?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and developers who are already building the future of data with our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sql">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600">
                <Zap className="mr-2 h-5 w-5" />
                Start Building Now
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Join Our Community
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

function StatCard({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <Card className="text-center p-6 bg-white/70 backdrop-blur">
      <div className={`text-3xl font-bold mb-2 ${color}`}>{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  )
}

function FeatureCard({ icon, title, description, benefits }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  benefits: string[] 
}) {
  return (
    <Card className="p-6 bg-white/70 backdrop-blur hover:shadow-lg transition-all hover:scale-105">
      <CardHeader className="pb-4">
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
        {icon}
      </div>
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}
