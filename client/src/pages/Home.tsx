import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, DollarSign, Search, Target, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-4 w-4" />
                AI-Powered Niche Research
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Find Your $10K/Month
              <br />
              <span className="text-primary">Rank & Rent Opportunity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop guessing. Let AI analyze thousands of niche/location combinations to identify profitable, 
              low-competition rank and rent opportunities in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="text-lg px-8" asChild>
                  <a href={getLoginUrl()}>
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              $49 Investment. $500+ Value. Unlimited Potential.
            </h2>
            <p className="text-lg text-muted-foreground">
              One profitable niche can generate $18,000+ per year. We help you find it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Save 40+ Hours</CardTitle>
                <CardDescription>
                  Manual niche research takes weeks. Our AI does it in minutes, analyzing thousands of 
                  opportunities instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Identify $1.5K-$5K/Month Niches</CardTitle>
                <CardDescription>
                  Get detailed CPC data, search volume, and revenue projections for each opportunity. 
                  Know exactly what you're getting into.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Avoid Costly Mistakes</CardTitle>
                <CardDescription>
                  Don't waste $2,000-$5,000 building sites in oversaturated markets. 
                  Find low-competition goldmines instead.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to your next profitable rank and rent site
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Niche & Location</h3>
              <p className="text-muted-foreground">
                Select from 100+ local service niches and enter your target city or region.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analyzes the Opportunity</h3>
              <p className="text-muted-foreground">
                Our AI evaluates search volume, competition, CPC, and profitability in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Detailed Report</h3>
              <p className="text-muted-foreground">
                Receive keywords, competitor analysis, domain suggestions, and revenue projections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included in Each Report</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Opportunity Score (1-100)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A single score representing the overall potential based on profitability, 
                  competition, and market demand.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  20+ Target Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Primary and long-tail keywords with search volume, CPC data, and difficulty scores.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Competitor Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Top 5 competitors with domain authority, estimated traffic, and ranking insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Revenue Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Estimated monthly revenue based on lead value, search volume, and conversion rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next $10K/Month Opportunity?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of rank and rent entrepreneurs who've discovered profitable niches with RankFinder AI.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <a href={getLoginUrl()}>
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

