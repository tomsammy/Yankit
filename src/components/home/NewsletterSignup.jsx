import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Mail, Send } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const NewsletterSignup = () => {
      const [email, setEmail] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
          toast({
            title: "Email Required",
            description: "Please enter your email address.",
            variant: "destructive",
          });
          return;
        }
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setEmail('');
        toast({
          title: "Subscribed!",
          description: "Thanks for signing up to the <span class='font-vernaccia-bold'>Yankit</span> newsletter!",
          variant: "default",
          className: "bg-green-500 dark:bg-green-600 text-white"
        });
      };

      return (
        <section className="py-16 md:py-24 bg-slate-100 dark:bg-slate-800/70">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl mx-auto text-center bg-white dark:bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl"
            >
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground dark:text-white mb-3">
                Stay Updated with <span className="font-vernaccia-bold">Yankit</span>
              </h2>
              <p className="text-muted-foreground dark:text-slate-300 mb-8">
                Subscribe to our newsletter for the latest news, offers, and travel tips.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-3 h-12 text-base dark:bg-slate-700 dark:border-slate-600"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <Send className="mr-2 h-5 w-5 animate-pulse" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      );
    };

    export default NewsletterSignup;