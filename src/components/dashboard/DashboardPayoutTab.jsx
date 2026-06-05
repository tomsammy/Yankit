import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const DashboardPayoutTab = ({ session }) => {
  const userEmail = session?.user?.email || "your-email@example.com";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-background/80 dark:bg-slate-900/80 shadow-xl border-none">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary dark:text-sky-400" />
            <div>
              <CardTitle className="text-2xl font-bold">Escrow.com Payout Integration</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-400">
                Receive payouts for completed yankings securely to your bank account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Payout Target Email</span>
              <div className="flex items-center space-x-2 text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 text-sm">
                <Mail className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700/50">
              ⚠️ <strong>Note:</strong> Payouts are automatically dispatched to the email above. Make sure your Escrow.com account is registered with this exact email to receive funds.
            </div>
          </div>

          <div className="text-sm text-muted-foreground dark:text-slate-400 space-y-3">
            <h4 className="font-semibold text-foreground dark:text-white flex items-center">
              <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
              Yankit Escrow & Payout Policy (Powered by Escrow.com)
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>When a Shipper initiates your match, they fund the transaction via <strong>Escrow.com</strong>.</li>
              <li>Funds are held securely by Escrow.com during transit.</li>
              <li>Once you deliver the item and the Shipper confirms receipt, Escrow.com releases the funds directly to your account.</li>
              <li>If you don't have an Escrow.com account yet, one will be created automatically under your email, and you will receive registration instructions.</li>
              <li>You can configure your withdrawal method (ACH, Wire Transfer, etc.) directly in your Escrow.com settings dashboard.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.open("https://www.escrow.com/login", "_blank")}
              className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-md shadow-lg flex items-center justify-center"
            >
              Go to Escrow.com portal
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardPayoutTab;
