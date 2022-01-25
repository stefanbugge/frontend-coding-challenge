import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";

export type PaginationProps = {
  totalPages: number;
  page: number;
  onChange: (nextPage: number) => void;
};

export function Pagination({ totalPages, page, onChange }: PaginationProps) {
  return (
    <div className="h-8 flex divide-x divide-gray-100 border border-gray-100 rounded-lg shadow text-gray-700 overflow-hidden">
      <SkipButton onClick={() => onChange(page - 1)} disabled={page === 1}>
        <ChevronLeftIcon className="h-5 w-5" />
      </SkipButton>
      <div className="flex items-center justify-center w-8 font-medium">
        {page}
      </div>
      <SkipButton
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </SkipButton>
    </div>
  );
}

function SkipButton(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      className="h-full w-8 flex items-center justify-center hover:bg-blue-100 focus:bg-blue-200 disabled:opacity-50 disabled:bg-transparent"
      {...props}
    />
  );
}
