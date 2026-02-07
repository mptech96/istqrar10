"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "../section-header/section-header";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const Contact = () => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const phoneNumber = "+966500000000";
  const email = "info@istqrar.sa";
  const address = "Riyadh, Saudi Arabia";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
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
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Input
                type="text"
                placeholder={t("Your Name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="bg-background/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder={t("Email Address")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="bg-background/50"
                required
              />
              <Input
                type="tel"
                placeholder={t("Phone Number")}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="bg-background/50"
              />
            </div>

            <div>
              <textarea
                placeholder={t("Your Message")}
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-input bg-background/50 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-coralRed to-cyan-600 hover:from-coralRed hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(240,89,87,0.3)]"
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
