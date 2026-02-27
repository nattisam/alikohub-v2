import { Mail, Phone, MapPin, FileText, ArrowRight, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

const ClientContactPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact & Guidance</h1>
          <p className="text-sm text-gray-500 mt-1">Get support and learn how to use the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MessageSquare className="w-5 h-5 text-[#3E92D1]" />
                Get in Touch
              </CardTitle>
              <CardDescription>
                Reach out to our support team for assistance with your projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#3E92D1]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-500 mt-1">support@contech.com</p>
                  <p className="text-xs text-gray-400 mt-0.5">Response time: 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#3E92D1]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-sm text-gray-500 mt-1">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-400 mt-0.5">Mon-Fri, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#3E92D1]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Office</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    123 Construction Ave.<br />
                    Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidance & Resources */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <BookOpen className="w-5 h-5 text-[#3E92D1]" />
                Client Guidance Resources
              </CardTitle>
              <CardDescription>
                Guides and documentation to help you manage your construction projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <a href="#" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#3E92D1]/30 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-[#3E92D1] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#3E92D1] transition-colors" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-[#3E92D1] transition-colors">Project Dashboard Guide</h3>
                <p className="mt-1 text-sm text-gray-500">Learn how to navigate your dashboard and track project progress effectively.</p>
              </a>

              <a href="#" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#3E92D1]/30 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-[#3E92D1] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#3E92D1] transition-colors" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-[#3E92D1] transition-colors">Understanding Reports</h3>
                <p className="mt-1 text-sm text-gray-500">A detailed guide on how to read and interpret construction status reports.</p>
              </a>

              <a href="#" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#3E92D1]/30 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-[#3E92D1] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#3E92D1] transition-colors" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-[#3E92D1] transition-colors">Safety Protocols</h3>
                <p className="mt-1 text-sm text-gray-500">Overview of site safety standards and what you need to know as a client.</p>
              </a>

              <a href="#" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#3E92D1]/30 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-[#3E92D1] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#3E92D1] transition-colors" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-[#3E92D1] transition-colors">Payment & Invoicing</h3>
                <p className="mt-1 text-sm text-gray-500">How to manage payments, view invoices, and track budget utilization.</p>
              </a>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-[#3E92D1] to-[#2E82C1] text-white">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Need personalized assistance?</h3>
                <p className="mt-2 text-white/80 max-w-lg">
                  Our dedicated client success managers are available to schedule a one-on-one call to walk you through any complex requirements.
                </p>
              </div>
              <button className="whitespace-nowrap bg-white text-[#3E92D1] px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all text-sm hover:bg-blue-50">
                Schedule a Call
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientContactPage;
