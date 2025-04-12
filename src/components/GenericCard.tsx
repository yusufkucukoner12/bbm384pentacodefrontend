import React from 'react';
import { Link } from 'react-router-dom';
import { GenericCardProps } from '../types/GenericCardProps';

interface ExtendedGenericCardProps extends GenericCardProps {
  loading?: boolean;
}

export default function GenericCard({
  title,
  description,
  imageUrl,
  footerContent,
  to,
  toData,
  children,
  loading = false,
}: ExtendedGenericCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-4 w-64 transition hover:scale-105 hover:shadow-lg ${
        loading ? 'animate-pulse' : ''
      }`}
    >
      <div className="relative h-40 w-full mb-3">
        {loading ? (
          <div className="h-full w-full rounded-xl bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        ) : to ? (
          <Link to={to} state={toData}>
            <img
              src={imageUrl}
              alt={title}
              className="h-40 w-full object-cover rounded-xl"
            />
          </Link>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="h-40 w-full object-cover rounded-xl"
          />
        )}
      </div>
      <h3
        className={`text-lg font-bold ${loading ? 'blur-sm bg-gray-200 rounded inline-block w-full h-6' : ''}`}
      >
        {loading ? ' ' : title}
      </h3>
      {description && (
        <p
          className={`text-gray-600 text-sm mb-2 ${
            loading ? 'blur-sm bg-gray-200 rounded inline-block w-3/4 h-4 mt-2' : ''
          }`}
        >
          {loading ? ' ' : description}
        </p>
      )}
      {footerContent && (
        <div
          className={`text-right font-semibold text-green-600 ${
            loading ? 'blur-sm bg-gray-200 rounded inline-block w-1/2 h-4 float-right' : ''
          }`}
        >
          {loading ? ' ' : footerContent}
        </div>
      )}
      <div className="mt-4">{loading ? null : children}</div>
    </div>
  );
}