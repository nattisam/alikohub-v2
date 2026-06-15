import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";

import { useMyTransactions } from "@/hooks/usePayment";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "Access to free courses",
      "Community forums",
      "Basic certifications",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "All free features",
      "Unlimited courses",
      "Priority support",
      "Advanced certifications",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Team management",
      "Custom training",
      "Dedicated support",
    ],
    current: false,
  },
];

const Subscriptions = () => {
  const { data: transactions, isLoading: transactionsLoading } =
    useMyTransactions();

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-4xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Subscriptions
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card rounded-xl border p-6 ${plan.current ? "ring-2 ring-primary" : ""}`}
            >
              {plan.current && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  Current Plan
                </span>
              )}
              <h3 className="text-xl font-heading font-bold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-heading font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? "outline" : "default"}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current
                  ? "Current"
                  : plan.price === "Custom"
                    ? "Contact Sales"
                    : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground">
              Transaction History
            </h2>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm text-left">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Purpose
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactionsLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions && transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          #{tx.id}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {tx.purpose?.replace(/_/g, " ") || "PAYMENT"}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {tx.amount} {tx.currency}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-700"
                                : tx.status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
