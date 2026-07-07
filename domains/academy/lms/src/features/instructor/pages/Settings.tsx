import React from "react";
import InstructorLayout from "@/features/instructor/components/InstructorLayout";
import { Settings, User, Shield, Bell, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InstructorSettings = () => {
  return (
    <InstructorLayout>
      <main className="section-container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-slate-900 border-none">
            Instructor Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your teaching profile, preferences, and account security.
          </p>
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website / Portfolio</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Instructor Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell your students about your experience and teaching style..."
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-amber-light text-slate-900">
                  Save Profile Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </InstructorLayout>
  );
};

export default InstructorSettings;
