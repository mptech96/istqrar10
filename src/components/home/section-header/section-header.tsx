const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <header className="text-center">
      <span
        className=" text-center relative text-3xl tracking-wider font-stretch-75% font-bold after:content-[''] after:absolute after:top-full 
         after:w-20 after:h-0.5 after:bg-coralRed
       after:z-10  after:left-1/2 after:-translate-x-1/2  "
      >
        {title}
      </span>
      {subtitle && (
        <p className="text-gray-600">{subtitle}</p>
      )}
    </header>
  );
};

export default SectionHeader;
