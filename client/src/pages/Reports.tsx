import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3, FileText, LogOut, Target } from "lucide-react";
import { Link } from "wouter";

export default function Reports() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Fetch user reports
  const { data: reports, isLoading } = trpc.reports.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading || isLoading) {
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
              <h1 className="text-3xl font-bold mb-2">My Reports</h1>
              <p className="text-muted-foreground">
                View all your generated niche analyses
              </p>
            </div>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Reports List */}
          {reports && reports.length > 0 ? (
            <div className="grid gap-6">
              {reports.map((report) => (
                <Link key={report.id} href={`/reports/${report.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {report.niche} - {report.location}
                          </CardTitle>
                          <CardDescription>
                            Generated on {new Date(report.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                            <Target className="h-4 w-4" />
                            {report.opportunityScore}/100
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Search Volume</p>
                          <p className="font-semibold">{report.searchVolume.toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Avg CPC</p>
                          <p className="font-semibold">${(report.avgCpc / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Competition</p>
                          <p className="font-semibold">{report.competitionLevel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Revenue Potential</p>
                          <p className="font-semibold text-primary">
                            ${(report.revenueProjection / 100).toLocaleString()}/mo
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Reports Yet</CardTitle>
                  <CardDescription className="mb-6">
                    Generate your first niche report to get started
                  </CardDescription>
                  <Link href="/dashboard">
                    <Button>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

