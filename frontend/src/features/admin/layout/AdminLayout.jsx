import React from "react";

const AdminLayout = ({ title, subtitle, actions, children }) => {
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-golden-500 whitestone:text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-golden-300 whitestone:text-gray-700 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
        {children}
      </div>
    </section>
  );
};

export default AdminLayout;
