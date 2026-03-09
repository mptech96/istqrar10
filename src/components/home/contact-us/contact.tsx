"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "../section-header/section-header";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormData,
} from "@/schema/contact";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import z from "zod";
import { useLoader } from "@/hooks/use-loader";

const Contact = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { start, stop } = useLoader();
  useEffect(() => {
    if (isSubmitting) {
      start();
    } else {
      stop();
    }
  }, [isSubmitting, start, stop, t]);

  const form = useForm<
    z.infer<ReturnType<typeof contactSchema>>
  >({
    resolver: zodResolver(contactSchema(t)) as Resolver<
      z.infer<ReturnType<typeof contactSchema>>
    >,
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const phoneNumber = "+966593283732";
  const email = "info@qsco.sa";
  const address = "Riyadh, Saudi Arabia";

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      form.reset();
      toast.success(t("Message sent successfully!"));
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(t("Failed to send message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader title={t("Contact Us")} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-muted-foreground leading-relaxed">
            {t("contact_description")}
          </p>

          {/* Contact Cards */}
          <div className="space-y-4">
            {/* Phone */}
            <motion.a
              href={`https://wa.me/${phoneNumber.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-coralRed/5 border border-coralRed/20 hover:border-coralRed/40 hover:bg-coralRed/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="p-3 rounded-full bg-coralRed/10 text-coralRed group-hover:bg-coralRed group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("Phone / WhatsApp")}
                </p>
                <p className="font-medium">{phoneNumber}</p>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("Email")}
                </p>
                <p className="font-medium">{email}</p>
              </div>
            </motion.a>

            {/* Address */}
            <motion.div
              className="flex items-center gap-4 p-4 rounded-xl bg-coralRed/5 border border-coralRed/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="p-3 rounded-full bg-coralRed/10 text-coralRed">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("Address")}
                </p>
                <p className="font-medium">{address}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="p-6 rounded-2xl bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/10"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-6">
            {t("Send us a message")}
          </h3>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                type="text"
                placeholder={t("Your Name")}
                {...form.register("name")}
                className={`bg-background/50 ${form.formState.errors.name ? "border-red-500" : ""}`}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  type="email"
                  placeholder={t("Email Address")}
                  {...form.register("email")}
                  className={`bg-background/50 ${form.formState.errors.email ? "border-red-500" : ""}`}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder={t("Phone Number")}
                  {...form.register("phone")}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <textarea
                placeholder={t("Your Message")}
                {...form.register("message")}
                rows={4}
                className={`w-full px-3 py-2 rounded-md border border-input bg-background/50 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none ${form.formState.errors.message ? "border-red-500" : ""}`}
              />
              {form.formState.errors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-coralRed to-cyan-600 hover:from-coralRed hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(240,89,87,0.3)] disabled:opacity-70"
            >
              <Send className="w-4 h-4 me-2" />
              {t("Send Message")}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
