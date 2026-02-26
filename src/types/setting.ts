export type SettingValueMap = {
  string: string;
  number: number;
  boolean: boolean;
  select: string;
  json: Record<string, unknown>;
};

export type SettingType = keyof SettingValueMap;

export type SmartSetting<T extends SettingType> = {
  id: number;
  group: string;
  key: string;
  value: SettingValueMap[T];
  formatted_value: SettingValueMap[T];
  type: T;
  data_type: string | null;
  validation_rules: string | null;
  options: string[];
  label: string;
  description: string;
  placeholder: string | null;
  sort_order: number;
  is_public: boolean;
  is_encrypted: boolean;
  is_required: boolean;
  created_at: string;
  updated_at: string;
};
