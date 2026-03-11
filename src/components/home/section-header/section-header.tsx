const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <header className="flex flex-col items-center justify-center gap-4">
      <div className="inline-flex items-center gap-2 px-8 py-4 rounded-[16px] bg-gradient-to-r from-[rgba(235,55,79,0.07)] to-[rgba(188,31,52,0.07)]">
        <span
          className="text-coralRed text-3xl font-bold leading-none flex items-center gap-4"
          style={{ fontStretch: "75%" }}
        >
          {title}
          <span className="w-2.5 h-2.5 rounded-full bg-coralRed" />
        </span>
      </div>

      {subtitle && (
        <p className="text-gray-600 max-w-2xl text-center">
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
