import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Shield,
  Palette,
  CreditCard,
  Trash2,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NotificationSettings from "@/components/settings/NotificationSettings";

const SettingsSection = ({ title, description, icon: Icon, children }) => (
  <Card className="bg-background/70 dark:bg-slate-800/50 shadow-lg border-border dark:border-slate-700/50">
    <CardHeader className="pb-4">
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-primary dark:text-purple-400" />
        <div>
          <CardTitle className="text-xl text-foreground dark:text-slate-100">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-slate-400">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const DashboardSettingsTab = () => {
  const { toast } = useToast();
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    toast({
      title: "Deleting Account...",
      description: "Please wait.",
    });

    const { error: deleteError } = await supabase.rpc("delete_user_account");

    if (deleteError) {
      toast({
        title: "Deletion Failed",
        description: deleteError.message,
        variant: "destructive",
      });
      setIsDeleting(false);
      return;
    }

    await signOut();

    toast({
      title: "Account Deleted",
      description: "Your account has been permanently removed.",
    });

    setIsDeleting(false);
    setShowDeleteConfirm(false);

    navigate("/");
  };

  return (
    <div className="space-y-8 text-foreground dark:text-slate-200">
      <SettingsSection
        title="Account Settings"
        description="Manage your account details and preferences."
        icon={Shield}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue={session?.user?.email || ""}
              disabled
              className="mt-1 bg-muted dark:bg-slate-700/60 dark:text-slate-400"
            />
          </div>
          <Button
            variant="outline"
            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
            onClick={() => navigate("/change-password")}
          >
            <KeyRound className="mr-2 h-4 w-4" /> Change Password
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notification Preferences"
        description="Control how you receive notifications from Baggit."
        icon={Bell}
      >
        <NotificationSettings />
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Customize the look and feel of your dashboard."
        icon={Palette}
      >
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Theme settings are managed using the global toggle.
        </p>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions for your account."
        icon={Trash2}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-destructive/10 dark:bg-red-900/20 rounded-lg">
          <div>
            <p className="font-semibold text-destructive dark:text-red-400">
              Delete Account
            </p>
            <p className="text-sm text-muted-foreground dark:text-red-400/80">
              Once deleted, this cannot be undone.
            </p>
          </div>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
            className="mt-3 sm:mt-0"
          >
            Delete My Account
          </Button>
        </div>
      </SettingsSection>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your account and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner className="mr-2" /> Deleting...
                </>
              ) : (
                "Yes, delete my account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SettingsSection
        title="Sign Out"
        description="Securely sign out of your Baggit account."
        icon={LogOut}
      >
        <Button
          onClick={async () => {
            await signOut();
            navigate("/signin");
          }}
          variant="outline"
          className="w-full sm:w-auto dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Sign Out
        </Button>
        <p className="mt-2 text-xs text-muted-foreground dark:text-slate-500">
          You will be logged out from this device.
        </p>
      </SettingsSection>
    </div>
  );
};

export default DashboardSettingsTab;
