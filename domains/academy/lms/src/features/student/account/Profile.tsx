import React from "react";
import StudentLayout from "@/features/student/components/StudentLayout";
import { User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/features/auth/hooks/useAuth";

const Profile = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <main className="section-container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-slate-900 border-none">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstname || ""}
                    placeholder="e.g. John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastname || ""}
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <textarea
                  id="bio"
                  defaultValue={user?.bio || ""}
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </StudentLayout>
  );
};

export default Profile;
