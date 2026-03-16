"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createSubscriptionRequestSchema,
  SubscriptionRequestFormValues,
} from "@/schema/subscription-request.schema.zod";
import { useCreateServiceRequestMutation } from "@/services/api/plans";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SubscriptionRequestFormProps {
  packageName: string;
}

const SubscriptionRequestForm = ({
  packageName,
}: SubscriptionRequestFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [createRequest, { isLoading }] =
    useCreateServiceRequestMutation();

  const subject =
    t("Subscription Request for") + " " + packageName;
  const form = useForm<SubscriptionRequestFormValues>({
    resolver: zodResolver(
      createSubscriptionRequestSchema(t),
    ),
    defaultValues: {
      request_type: "package_request",
      package_name: packageName,
      customer_name: "",
      company_name: "",
      phone: "",
      email: "",
      subject,
      message: "",
    },
  });

  const onSubmit = async (
    values: SubscriptionRequestFormValues,
  ) => {
    try {
      await createRequest(values).unwrap();
      toast.success(t("Request sent successfully"));
      form.reset();
      router.push("/");
    } catch (error) {
      console.error("Subscription request error:", error);
      toast.error(t("Failed to send request"));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-coralRed">
          {t("Request Subscription")}
        </CardTitle>
        <CardDescription>
          {t("Fill out the form below to request the")}{" "}
          <span className="font-bold text-darkRed underline underline-offset-4 decoration-coralRed/30">
            {packageName}
          </span>{" "}
          {/* {t("plan")} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("Customer Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Full name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("Company Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Company Name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("Phone Number")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Phone Number")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("Email address")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Subject")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "Additional details or requirements",
                      )}
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-coralRed hover:bg-darkRed h-12 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading
                ? t("Sending")
                : t("Submit Request")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionRequestForm;
