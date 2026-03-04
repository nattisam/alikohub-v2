import Navbar from "@/components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <p className="text-muted-foreground">
            Welcome to the Academy Admin Dashboard. Here you can manage users,
            roles, and applications.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
