import React from 'react';
import { Link } from 'react-router-dom';
import { GenericCardProps } from '../types/GenericCardProps';

export default function GenericCard({
  title,
  description,
  imageUrl = '/placeholder.jpg',
  footerContent,
  to,
  toData,
}: GenericCardProps) {
  
    const content = (
    <div className="bg-white rounded-2xl shadow-md p-4 w-64 transition hover:scale-105 hover:shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="h-40 w-full object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
      {footerContent && (
        <div className="text-right font-semibold text-green-600">{footerContent}</div>
      )}
    </div>
  );

  return to ? <Link to={to} state={toData}>{content} </Link> : content;
}
