import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { MailCheck, Send, Loader2 } from 'lucide-react';

    const ContactFormSection = () => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Form submitted:', formData);
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. Our team will review your message and get back to you as soon as possible.",
          variant: "default",
          className: "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white dark:text-white"
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
      };

      return (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 shadow-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-lg border-slate-300/50 dark:border-slate-700/50 rounded-xl">
          <CardHeader className="text-center p-0 mb-8">
            <motion.div 
              className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MailCheck className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">
              Send Us a Direct Message
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-slate-300 mt-2 text-lg">
              Have a specific question or need detailed assistance? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground dark:text-slate-200 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/70 focus:border-primary dark:focus:border-secondary focus:ring-primary dark:focus:ring-secondary rounded-md py-3 px-4 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground dark:text-slate-200 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., alex.johnson@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/70 focus:border-primary dark:focus:border-secondary focus:ring-primary dark:focus:ring-secondary rounded-md py-3 px-4 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground dark:text-slate-200 font-medium">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Question about my listing"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/70 focus:border-primary dark:focus:border-secondary focus:ring-primary dark:focus:ring-secondary rounded-md py-3 px-4 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground dark:text-slate-200 font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your query in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/70 focus:border-primary dark:focus:border-secondary focus:ring-primary dark:focus:ring-secondary rounded-md py-3 px-4 text-base min-h-[150px]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-lg py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white dark:to-secondary rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Your Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    };

    export default ContactFormSection;