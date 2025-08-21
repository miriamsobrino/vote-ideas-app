interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "button" | "link";
}

export const Button = ({
  variant = "button",
  children,
  className,
  ...props
}: ButtonProps) => {
  const base = "transition-all duration-300 cursor-pointer";

  const styles = {
    button:
      "bg-indigo-100/40 border border-indigo-200 justify-center  px-3 w-24 py-1 rounded-md hover:bg-indigo-100/60 hover:-rotate-1 text-center flex gap-1 items-center group disabled:opacity-50 disabled:hover:bg-indigo-100/40 disabled:hover:rotate-0 disabled:hover:cursor-default",
    link: "relative px-0 py-0   before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[1px] before:bg-gray-600 before:transition-all before:duration-300 hover:before:left-0 hover:before:w-full",
  };

  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};
