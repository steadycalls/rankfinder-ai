import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3, DollarSign, Globe, LogOut, Search, Target, TrendingUp } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ReportDetail() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  // Fetch report details
  const { data: report, isLoading } = trpc.reports.get.useQuery(
    { id: parseInt(id || "0") },
    { enabled: isAuthenticated && !!id }
  );

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>The report you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompetitionColor = (level: string) => {
    if (level === "Low") return "text-green-600";
    if (level === "Medium") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Target className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost">My Reports</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {report.niche} - {report.location}
                </h1>
                <div className={`text-3xl font-bold ${getScoreColor(report.opportunityScore)}`}>
                  {report.opportunityScore}/100
                </div>
              </div>
              <p className="text-muted-foreground">
                Generated on {new Date(report.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link href="/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Opportunity Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(report.opportunityScore)}`}>
                  {report.opportunityScore}/100
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.opportunityScore >= 80 ? "Excellent" : report.opportunityScore >= 60 ? "Good" : "Fair"} opportunity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Search Volume</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.searchVolume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">searches per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average CPC</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(report.avgCpc / 100).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">cost per click</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ${(report.revenueProjection / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </CardContent>
            </Card>
          </div>

          {/* Competition Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Competition Level</span>
                  <span className={`font-semibold ${getCompetitionColor(report.competitionLevel)}`}>
                    {report.competitionLevel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {report.competitionLevel === "Low" && "Great opportunity! Low competition makes it easier to rank and capture market share."}
                  {report.competitionLevel === "Medium" && "Moderate competition. With good SEO strategy, you can compete effectively."}
                  {report.competitionLevel === "High" && "High competition. Requires strong SEO and differentiation strategy."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Target Keywords
              </CardTitle>
              <CardDescription>
                Primary and long-tail keywords to target for this niche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Search Volume</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.keywords.slice(0, 10).map((kw: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{kw.keyword}</TableCell>
                      <TableCell className="text-right">{kw.searchVolume.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${(kw.cpc / 100).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className={kw.difficulty < 40 ? "text-green-600" : kw.difficulty < 70 ? "text-yellow-600" : "text-red-600"}>
                          {kw.difficulty}/100
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Competitors
              </CardTitle>
              <CardDescription>
                Existing players in this niche and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Domain Authority</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.competitors.map((comp: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{comp.name}</TableCell>
                      <TableCell>
                        <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {comp.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">{comp.domainAuthority}/100</TableCell>
                      <TableCell className="text-right">{comp.estimatedTraffic.toLocaleString()}/mo</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Available Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Available Domains
              </CardTitle>
              <CardDescription>
                Suggested domain names for this niche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {report.domains.map((domain: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-mono text-sm">{domain}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://www.namecheap.com/domains/registration/results/?domain=${domain}`} target="_blank" rel="noopener noreferrer">
                        Check
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

