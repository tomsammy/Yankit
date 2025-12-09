import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Briefcase } from 'lucide-react';
    import { format } from "date-fns";

    const BaggageOfferCard = ({ offer }) => (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism dark:bg-slate-800/50 dark:border-slate-700/50">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-xl font-semibold text-green-600 dark:text-green-400">
                        {offer.origin} &rarr; {offer.destination}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground dark:text-slate-400">
                        Offer ID: {offer.id.slice(0,8)}
                    </CardDescription>
                </div>
                <Briefcase className="w-10 h-10 text-green-600/70 dark:text-green-400/70" />
            </div>
        </CardHeader>
        <CardContent className="space-y-2">
            <p className="text-sm text-foreground dark:text-slate-200"><strong>Travel Date:</strong> {format(new Date(offer.travelDate), "PPP")}</p>
            <p className="text-sm text-foreground dark:text-slate-200"><strong>Available Space:</strong> {offer.availableWeight} kg</p>
            <p className="text-sm text-foreground dark:text-slate-200"><strong>Price:</strong> ${offer.pricePerKg}/kg</p>
            {offer.itemRestrictions && <p className="text-xs text-muted-foreground dark:text-slate-400"><strong>Restrictions:</strong> {offer.itemRestrictions}</p>}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 dark:border-orange-500/70 dark:text-orange-500 dark:hover:bg-orange-500/20">Edit Offer</Button>
            <Button variant="destructive" size="sm">Remove Offer</Button>
        </CardFooter>
      </Card>
    );

    export default BaggageOfferCard;