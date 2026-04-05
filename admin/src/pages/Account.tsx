import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthstore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User, Lock, Mail, AlertCircle } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AccountPage() {
  const { user, updateUser } = useAuthStore();
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id) return;

    if (!profileData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setLoading(true);
    try {
      await axiosPrivate.put(`/users/${user._id}`, {
        name: profileData.name,
        avatar: profileData.avatar,
      });

      // Update the auth store with the new user data
      updateUser({
        name: profileData.name,
        avatar: profileData.avatar,
      });

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors: string[] = [];

    if (!passwordData.currentPassword) {
      errors.push("Current password is required");
    }
    if (!passwordData.newPassword) {
      errors.push("New password is required");
    }
    if (passwordData.newPassword.length < 6) {
      errors.push("New password must be at least 6 characters");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push("New passwords do not match");
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      errors.push("New password must be different from current password");
    }

    return errors;
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordErrors([]);

    const errors = validatePassword();
    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast.error(errors[0]);
      return;
    }

    if (!user?._id) return;
    setPasswordLoading(true);
    try {
      await axiosPrivate.put(`/users/${user._id}`, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors([]);
    } catch (error: any) {
      console.error("Password update error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update password";
      setPasswordErrors([errorMessage]);
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-base">
          Manage your account profile and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full border-0 md:border shadow-sm md:shadow-md hover:shadow-md transition-shadow">
            <form onSubmit={handleProfileUpdate}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User size={18} className="text-blue-600 dark:text-blue-300" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your personal details and avatar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Avatar</Label>
                  <div className="p-4 rounded-lg border border-dashed bg-muted/50">
                    <ImageUpload
                      value={profileData.avatar}
                      onChange={(base64) =>
                        setProfileData({ ...profileData, avatar: base64 })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="pl-10 h-10"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-10 bg-muted cursor-not-allowed"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="ml-auto w-full sm:w-auto h-10"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full border-0 md:border shadow-sm md:shadow-md hover:shadow-md transition-shadow">
            <form onSubmit={handlePasswordUpdate}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Lock size={18} className="text-amber-600 dark:text-amber-300" />
                  </div>
                  Change Password
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your account password to stay secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {passwordErrors.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        {passwordErrors.map((error, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-red-700 dark:text-red-300"
                          >
                            • {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label
                    htmlFor="current-password"
                    className="text-base font-medium"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    className="h-10"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="new-password" className="text-base font-medium">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password (min. 6 characters)"
                    className="h-10"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="confirm-password"
                    className="text-base font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="h-10"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="ml-auto w-full sm:w-auto h-10 bg-amber-600 hover:bg-amber-700"
                >
                  {passwordLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" /> Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

