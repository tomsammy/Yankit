import React from "react";
import { motion } from "framer-motion";
import { Star, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "Using <span class='font-vernaccia-bold'>Baggit</span> was a breeze! I sent a gift to my family overseas for half the usual cost. The traveler was communicative and everything arrived perfectly.",
    name: "Aisha K.",
    location: "Shipper - Sydney to Lagos",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
    rating: 5,
  },
  {
    quote:
      "I travel frequently for work and <span class='font-vernaccia-bold'>Baggit</span> helps me cover some of my flight costs. It's easy to list my space and connect with shippers. Highly recommend!",
    name: "Ben L.",
    location: "Traveler - Melbourne to London",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
    rating: 5,
  },
  {
    quote:
      "Needed to send urgent documents and <span class='font-vernaccia-bold'>Baggit</span> came through. Found a traveler leaving the next day. Much faster and cheaper than express courier services.",
    name: "Sarah P.",
    location: "Shipper - Perth to Singapore",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
    rating: 4,
  },
];

const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 dark:from-slate-800/30 dark:via-blue-900/30 dark:to-slate-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-3">
            Loved by Shippers & Travelers Alike
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
            Hear what our community says about their{" "}
            <span className="font-vernaccia-bold">Baggit</span> experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star
                    key={i + testimonial.rating}
                    className="w-5 h-5 text-yellow-400/50"
                  />
                ))}
              </div>
              <p
                className="text-muted-foreground dark:text-slate-300 italic mb-6 flex-grow"
                dangerouslySetInnerHTML={{ __html: `"${testimonial.quote}"` }}
              ></p>
              <div className="flex items-center mt-auto">
                <Avatar className="h-12 w-12 mr-4 border-2 border-primary/50">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(testimonial.name) || <UserCircle size={24} />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
