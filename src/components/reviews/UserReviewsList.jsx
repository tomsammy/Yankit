import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Star, UserCircle, MessageSquare, Calendar } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { formatDistanceToNow } from 'date-fns';
    import LoadingSpinner from '@/components/ui/LoadingSpinner';

    const UserReviewsList = ({ userId }) => {
      const [reviews, setReviews] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const fetchReviews = async () => {
          setIsLoading(true);
          setError(null);
          try {
            const { data, error: fetchError } = await supabase
              .from('reviews')
              .select(`
                id,
                rating,
                comment,
                created_at,
                review_type,
                shipment_id,
                reviewer:reviewer_user_id ( id, full_name, avatar_url )
              `)
              .eq('reviewed_user_id', userId)
              .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setReviews(data || []);
          } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews. Please try again later.');
          } finally {
            setIsLoading(false);
          }
        };

        fetchReviews();
      }, [userId]);

      if (isLoading) {
        return <div className="flex justify-center items-center py-10"><LoadingSpinner /></div>;
      }

      if (error) {
        return <p className="text-center text-red-500 dark:text-red-400 py-10">{error}</p>;
      }

      if (reviews.length === 0) {
        return <p className="text-center text-muted-foreground dark:text-slate-400 py-10">No reviews yet.</p>;
      }

      return (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardHeader className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-primary dark:border-purple-500">
                      <AvatarImage src={review.reviewer?.avatar_url} alt={review.reviewer?.full_name || 'Reviewer'} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-primary dark:text-purple-300">
                        {review.reviewer?.full_name ? review.reviewer.full_name.charAt(0).toUpperCase() : <UserCircle size={20} />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {review.reviewer?.full_name || 'Anonymous Reviewer'}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Reviewed <span className="font-medium">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-500"}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {review.comment ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No comment provided.</p>
                )}
                <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Shipment ID: {review.shipment_id.slice(0,8)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    };

    export default UserReviewsList;