export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="flex-1 focus:outline-0 border-1 focus:border-indigo-200 border-indigo-100 rounded-md px-4 py-2 bg-slate-50/40"
      {...props}
    />
  );
};
