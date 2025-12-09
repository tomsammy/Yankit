import React, { useState } from 'react';
    import { useForm } from 'react-hook-form';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { LockKeyhole, ArrowLeft } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';

    const ChangePasswordPage = () => {
        const { register, handleSubmit, formState: { errors }, watch } = useForm();
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast();
        const navigate = useNavigate();
        const newPassword = watch("newPassword");

        const onSubmit = async (data) => {
            setIsLoading(true);
            const { error } = await supabase.auth.updateUser({ password: data.newPassword });
            setIsLoading(false);

            if (error) {
                toast({
                    title: 'Error Changing Password',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success!',
                    description: 'Your password has been changed successfully.',
                    className: 'bg-green-500 text-white',
                });
                navigate('/dashboard?tab=settings');
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto flex items-center justify-center min-h-[calc(100vh-180px)] py-12 px-4"
            >
                <div className="w-full max-w-md">
                    <Button variant="ghost" onClick={() => navigate('/dashboard?tab=settings')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                    <Card className="shadow-2xl glassmorphism dark:bg-slate-800/60 dark:border-slate-700">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 dark:bg-purple-500/20 rounded-full p-3 w-fit mb-4">
                                <LockKeyhole className="w-8 h-8 text-primary dark:text-purple-400" />
                            </div>
                            <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 dark:from-purple-400 dark:to-sky-400">
                                Change Your Password
                            </CardTitle>
                            <CardDescription className="text-muted-foreground dark:text-slate-400 pt-2">
                                Enter a new secure password for your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        {...register("newPassword", {
                                            required: "New password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters long"
                                            }
                                        })}
                                        className={errors.newPassword ? "border-destructive" : ""}
                                    />
                                    {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...register("confirmPassword", {
                                            required: "Please confirm your new password",
                                            validate: value =>
                                                value === newPassword || "The passwords do not match"
                                        })}
                                        className={errors.confirmPassword ? "border-destructive" : ""}
                                    />
                                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                                </div>

                                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white" disabled={isLoading}>
                                    {isLoading ? <LoadingSpinner /> : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        );
    };

    export default ChangePasswordPage;