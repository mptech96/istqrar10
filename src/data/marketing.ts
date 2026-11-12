export type ServiceIconKey =
  | "monitor"
  | "calendarCheck"
  | "zap"
  | "shieldCheck"
  | "graduationCap"
  | "fileText"
  | "layoutList"
  | "eye";

export interface ServiceItem {
  id: string;
  slug: string;
  iconKey: ServiceIconKey;
  titleKey: string;
  descKey: string;
  deliverableKeys: [string, string, string];
  audienceKey: string;
}

export interface WhyChooseUsItem {
  id: string;
  titleKey: string;
  detailKey: string;
}

export interface CertificationItem {
  id: string;
  titleKey: string;
  descKey: string;
  imageUrl: string;
  alt: string;
}

export interface PackageTierItem {
  id: string;
  tierKey: string;
  descKey: string;
  titleKey: string;
  isHighlighted?: boolean;
  featureKeys: string[];
}

export interface ComparisonRow {
  featureKey: string;
  starterKey: string;
  growthKey: string;
  enterpriseKey: string;
  isBoolean?: boolean;
  starterIncluded?: boolean;
  growthIncluded?: boolean;
  enterpriseIncluded?: boolean;
}

export const WHY_CHOOSE_US_DATA: WhyChooseUsItem[] = [
  {
    id: "01",
    titleKey: "Full support for small, medium and large enterprises",
    detailKey: "pillar_1_detail",
  },
  {
    id: "02",
    titleKey: "Improving compliance with food quality and safety regulations",
    detailKey: "pillar_2_detail",
  },
  {
    id: "03",
    titleKey: "Building and developing operational plans",
    detailKey: "pillar_3_detail",
  },
  {
    id: "04",
    titleKey: "Real field experience",
    detailKey: "pillar_4_detail",
  },
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: "haccp",
    titleKey: "cert_haccp_title",
    descKey: "cert_haccp_desc",
    imageUrl:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1773234775/c-1_nhrbn2.png",
    alt: "HACCP Certification",
  },
  {
    id: "iso-22000",
    titleKey: "cert_iso22000_title",
    descKey: "cert_iso22000_desc",
    imageUrl:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1773234773/c-2_zjeqwj.png",
    alt: "ISO 22000 Certification",
  },
  {
    id: "iso-9001",
    titleKey: "cert_iso9001_title",
    descKey: "cert_iso9001_desc",
    imageUrl:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1773234775/c-3_r4oibv.png",
    alt: "ISO 9001 Certification",
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "01",
    slug: "quality-measurement-platform",
    iconKey: "monitor",
    titleKey: "service_1",
    descKey: "svc_1_desc",
    deliverableKeys: ["svc_1_del_1", "svc_1_del_2", "svc_1_del_3"],
    audienceKey: "svc_1_audience",
  },
  {
    id: "02",
    slug: "certified-observer-visits",
    iconKey: "calendarCheck",
    titleKey: "service_2",
    descKey: "svc_2_desc",
    deliverableKeys: ["svc_2_del_1", "svc_2_del_2", "svc_2_del_3"],
    audienceKey: "svc_2_audience",
  },
  {
    id: "03",
    slug: "operational-error-handling",
    iconKey: "zap",
    titleKey: "service_3",
    descKey: "svc_3_desc",
    deliverableKeys: ["svc_3_del_1", "svc_3_del_2", "svc_3_del_3"],
    audienceKey: "svc_3_audience",
  },
  {
    id: "04",
    slug: "iso-and-haccp-systems",
    iconKey: "shieldCheck",
    titleKey: "service_4",
    descKey: "svc_4_desc",
    deliverableKeys: ["svc_4_del_1", "svc_4_del_2", "svc_4_del_3"],
    audienceKey: "svc_4_audience",
  },
  {
    id: "05",
    slug: "immediate-field-training",
    iconKey: "graduationCap",
    titleKey: "service_5",
    descKey: "svc_5_desc",
    deliverableKeys: ["svc_5_del_1", "svc_5_del_2", "svc_5_del_3"],
    audienceKey: "svc_5_audience",
  },
  {
    id: "06",
    slug: "detailed-visit-reports",
    iconKey: "fileText",
    titleKey: "service_6",
    descKey: "svc_6_desc",
    deliverableKeys: ["svc_6_del_1", "svc_6_del_2", "svc_6_del_3"],
    audienceKey: "svc_6_audience",
  },
  {
    id: "07",
    slug: "food-safety-building-plan",
    iconKey: "layoutList",
    titleKey: "service_7",
    descKey: "svc_7_desc",
    deliverableKeys: ["svc_7_del_1", "svc_7_del_2", "svc_7_del_3"],
    audienceKey: "svc_7_audience",
  },
  {
    id: "08",
    slug: "third-party-neutral-monitoring",
    iconKey: "eye",
    titleKey: "service_8",
    descKey: "svc_8_desc",
    deliverableKeys: ["svc_8_del_1", "svc_8_del_2", "svc_8_del_3"],
    audienceKey: "svc_8_audience",
  },
];

export const WORKFLOW_STEPS = [
  { id: "01", titleKey: "workflow_1_title", descKey: "workflow_1_desc" },
  { id: "02", titleKey: "workflow_2_title", descKey: "workflow_2_desc" },
  { id: "03", titleKey: "workflow_3_title", descKey: "workflow_3_desc" },
  { id: "04", titleKey: "workflow_4_title", descKey: "workflow_4_desc" },
];

export const PACKAGES_DATA: PackageTierItem[] = [
  {
    id: "starter",
    tierKey: "tier_starter",
    descKey: "tier_starter_desc",
    titleKey: "plan_title",
    featureKeys: [
      "feature_1",
      "feature_2",
      "feature_3",
      "feature_4",
      "feature_5",
      "feature_6",
    ],
  },
  {
    id: "growth",
    tierKey: "tier_growth",
    descKey: "tier_growth_desc",
    titleKey: "plan_title",
    isHighlighted: true,
    featureKeys: [
      "feature_1_v2",
      "feature_2_v2",
      "feature_3_v2",
      "feature_5",
      "feature_4",
      "feature_6",
    ],
  },
  {
    id: "enterprise",
    tierKey: "tier_enterprise",
    descKey: "tier_enterprise_desc",
    titleKey: "plan_title",
    featureKeys: [
      "feature_1_v3",
      "feature_2_v3",
      "feature_3_v3",
      "feature_4_v3",
      "feature_5_v3",
      "feature_5",
      "feature_7",
      "feature_4",
      "feature_6",
      "feature_8",
    ],
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    featureKey: "Platform Users",
    starterKey: "1 User",
    growthKey: "2 Users",
    enterpriseKey: "3 Users",
  },
  {
    featureKey: "Monthly Observer Visits",
    starterKey: "1 Visit / Month",
    growthKey: "2 Visits / Month",
    enterpriseKey: "4 Visits / Month",
  },
  {
    featureKey: "Comprehensive Reports",
    starterKey: "1 Report / Month",
    growthKey: "2 Reports / Month",
    enterpriseKey: "All Visits",
  },
  {
    featureKey: "Food Safety Building Plan",
    starterKey: "Included",
    growthKey: "Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: true,
    growthIncluded: true,
    enterpriseIncluded: true,
  },
  {
    featureKey: "24/7 Technical Support",
    starterKey: "Included",
    growthKey: "Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: true,
    growthIncluded: true,
    enterpriseIncluded: true,
  },
  {
    featureKey: "Add Extra Users",
    starterKey: "Included",
    growthKey: "Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: true,
    growthIncluded: true,
    enterpriseIncluded: true,
  },
  {
    featureKey: "On-Site Staff Training",
    starterKey: "Not Included",
    growthKey: "Not Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: false,
    growthIncluded: false,
    enterpriseIncluded: true,
  },
  {
    featureKey: "Dispute Resolution Tickets",
    starterKey: "Not Included",
    growthKey: "Not Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: false,
    growthIncluded: false,
    enterpriseIncluded: true,
  },
  {
    featureKey: "Custom Facility Services",
    starterKey: "Not Included",
    growthKey: "Not Included",
    enterpriseKey: "Included",
    isBoolean: true,
    starterIncluded: false,
    growthIncluded: false,
    enterpriseIncluded: true,
  },
];

export const SUBSCRIPTION_FAQS = [
  { qKey: "faq_1_q", aKey: "faq_1_a" },
  { qKey: "faq_2_q", aKey: "faq_2_a" },
  { qKey: "faq_3_q", aKey: "faq_3_a" },
  { qKey: "faq_4_q", aKey: "faq_4_a" },
];
