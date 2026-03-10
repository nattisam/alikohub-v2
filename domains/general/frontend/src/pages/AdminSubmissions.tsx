import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Submission {
    fullName: string;
    email: string;
    organization: string;
    role: string;
    partnershipInterest: string;
    message: string;
    submittedAt: string;
}

const AdminSubmissions = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("partnershipSubmissions");
        if (stored) {
            try {
                setSubmissions(JSON.parse(stored));
            } catch (error) {
                console.error("Failed to parse submissions:", error);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-6">
                    Partnership Submissions
                </h1>

                {submissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
                        No submissions found yet.
                    </div>
                ) : (
                    <div className="border border-border rounded-md bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Organization / Role</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead className="w-[300px]">Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((sub, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(sub.submittedAt).toLocaleDateString()}{" "}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(sub.submittedAt).toLocaleTimeString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{sub.fullName}</TableCell>
                                        <TableCell>{sub.email}</TableCell>
                                        <TableCell>
                                            {sub.organization}
                                            {sub.role && (
                                                <span className="block text-xs text-muted-foreground">
                                                    {sub.role}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{sub.partnershipInterest}</TableCell>
                                        <TableCell>
                                            <div className="max-h-24 overflow-y-auto text-sm text-muted-foreground pr-2">
                                                {sub.message || "-"}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminSubmissions;
