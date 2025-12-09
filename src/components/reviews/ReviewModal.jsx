import React, { useState } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import StarRatingInput from './StarRatingInput';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Send, Star as StarIcon } from 'lucide-react';

    const ReviewModal = ({ isOpen, setIsOpen, shipment, currentUser, otherUser, reviewType, onReviewSubmitted }) => {
      const [rating, setRating] = useState(0);
      const [comment, setComment] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const { toast } = useToast();

      const resetForm = () => {
        setRating(0);
        setComment('');
        setIsSubmitting(false);
      };

      const handleSubmitReview = async () => {
        if (rating === 0) {
          toast({
            title: 'Rating Required',
            description: 'Please select a star rating.',
            variant: 'destructive',
          });
          return;
        }
        if (!shipment || !currentUser || !otherUser) {
            toast({ title: 'Error', description: 'Missing required information for review.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
          const { data, error } = await supabase.from('reviews').insert({
            shipment_id: shipment.id,
            reviewer_user_id: currentUser.id,
            reviewed_user_id: otherUser.id,
            rating: rating,
            comment: comment,
            review_type: reviewType, 
          });

          if (error) {
            if (error.code === '23505') { 
              toast({
                title: 'Already Reviewed',
                description: 'You have already submitted a review for this transaction.',
                variant: 'default',
              });
            } else {
              throw error;
            }
          } else {
            toast({
              title: 'Review Submitted!',
              description: `Your review for ${otherUser.full_name || otherUser.email} has been submitted.`,
              className: 'bg-green-500 dark:bg-green-600 text-white',
            });
            if (onReviewSubmitted) onReviewSubmitted(data);
            resetForm();
            setIsOpen(false);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          toast({
            title: 'Error Submitting Review',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
        } finally {
          setIsSubmitting(false);
        }
      };
      
      if (!shipment || !currentUser || !otherUser) {
        return null; 
      }

      return (
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-850">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                Review Your Transaction
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Share your experience with {otherUser.full_name || otherUser.email} for shipment ID: {shipment.id.slice(0,8)}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Rating:</p>
                <StarRatingInput rating={rating} setRating={setRating} size={36} />
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Comment (Optional):
                </label>
                <Textarea
                  id="comment"
                  placeholder={`How was your experience with ${otherUser.full_name || otherUser.email}?`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-primary dark:focus:ring-purple-500"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleSubmitReview} 
                disabled={isSubmitting || rating === 0}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                {!isSubmitting && <Send size={16} className="ml-2" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default ReviewModal;