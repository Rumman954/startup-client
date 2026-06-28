const PageHeader = ({ eyebrow, title, subtitle, children, className = '' }) => (
  <div className={`mb-10 sm:mb-12 ${className}`}>
    {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
    <h1 className="section-title text-3xl md:text-4xl">{title}</h1>
    {subtitle && (
      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mt-3 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    )}
    {children}
  </div>
);

export default PageHeader;
