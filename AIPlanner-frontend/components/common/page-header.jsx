"use client";

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-on-surface">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export {
  PageHeader
};
