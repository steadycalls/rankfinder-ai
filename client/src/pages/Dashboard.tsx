import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Coins, FileText, LogOut, Search, Target } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedNiche, setSelectedNiche] = useState("");
  const [location, setLocationInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user credits
  const { data: credits, refetch: refetchCredits } = trpc.credits.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch niches list
  const { data: niches } = trpc.analysis.niches.useQuery();

  // Fetch user reports
  const { data: reports } = trpc.reports.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Generate report mutation
  const generateMutation = trpc.analysis.generate.useMutation({
    onSuccess: () => {
      toast.success("Report generated successfully!");
      refetchCredits();
      setLocation("/reports");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate report");
    },
  });

  // Purchase credits mutation
  const purchaseMutation = trpc.credits.purchase.useMutation({
    onSuccess: () => {
      toast.success("Credits purchased successfully!");
      refetchCredits();
    },
    onError: () => {
      toast.error("Failed to purchase credits");
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleGenerate = async () => {
    if (!selectedNiche || !location) {
      toast.error("Please select a niche and enter a location");
      return;
    }

    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({
        niche: selectedNiche,
        location: location,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePurchaseCredits = () => {
    // In a real app, this would integrate with Stripe
    // For demo purposes, we'll just add 10 credits
    purchaseMutation.mutate({ amount: 10 });
  };

  if (loading) {
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
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground">
              Generate detailed niche reports to find your next profitable rank and rent opportunity.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{credits?.credits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {credits?.credits === 0 ? "Purchase credits to generate reports" : "reports remaining"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports?.length || 0}</div>
                <p className="text-xs text-muted-foreground">niche analyses generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Opportunity</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports && reports.length > 0
                    ? Math.max(...reports.map((r) => r.opportunityScore))
                    : "—"}
                </div>
                <p className="text-xs text-muted-foreground">highest opportunity score</p>
              </CardContent>
            </Card>
          </div>

          {/* Generate Report Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Generate New Niche Report
              </CardTitle>
              <CardDescription>
                Select a niche and location to analyze the rank and rent opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche</Label>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger id="niche">
                      <SelectValue placeholder="Select a niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {niches?.map((niche: string) => (
                        <SelectItem key={niche} value={niche}>
                          {niche}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (City, State)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Austin, TX"
                    value={location}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Cost: <span className="font-semibold">1 credit</span> per report
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !credits || credits.credits <= 0}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Credits Section */}
          {credits && credits.credits === 0 && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Need More Credits?</CardTitle>
                <CardDescription>
                  Purchase report credits to continue analyzing niches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">$49 for 10 Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Each report provides comprehensive niche analysis worth $500+
                    </p>
                  </div>
                  <Button onClick={handlePurchaseCredits} size="lg">
                    <Coins className="mr-2 h-4 w-4" />
                    Purchase Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reports */}
          {reports && reports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest niche analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <Link key={report.id} href={`/reports/${report.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div>
                          <p className="font-semibold">
                            {report.niche} - {report.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Opportunity Score: {report.opportunityScore}/100
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">
                            ${(report.revenueProjection / 100).toFixed(0)}/mo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="pt-4">
                  <Link href="/reports">
                    <Button variant="outline" className="w-full">
                      View All Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

