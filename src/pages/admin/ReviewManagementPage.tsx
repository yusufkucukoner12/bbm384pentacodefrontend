import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';
import { SkeletonLoader } from '../../components/restaurants/SkeletonLoader'; // Assuming this component exists and is styled
import { Customer } from '../../types/Customer';
import { Restaurant } from '../../types/Restaurant';
import { OrderDTO, OrderStatusEnum } from '../../types/Order'; // Ensure OrderStatusEnum is imported

// Define the Review interface based on your provided structure
interface Review {
  pk: number;
  reviewText: string;
  rating: number;
  customer: Customer;    // Nested Customer object
  restaurant: Restaurant; // Nested Restaurant object
  order: OrderDTO;        // Nested OrderDTO object
  createdAt?: string; // Optional: if your review object has a creation date
}

// Star rating component
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const totalStars = 5;
  const starSizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`${starSizeClass} ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.454a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.04 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};


export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 8; // Adjusted items per page

  const token = localStorage.getItem('token');

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!token) {
        setError('Authentication token not found.');
        toast.error('Authentication token not found.');
        setLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:8080/api/order/get-all-reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedReviews = Array.isArray(response.data.data) ? response.data.data : [];
      // Sort reviews by most recent if createdAt is available, otherwise by PK descending
      fetchedReviews.sort((a: Review, b: Review) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.pk - a.pk;
      });
      setReviews(fetchedReviews);
      setFilteredReviews(fetchedReviews);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading reviews:', err);
      const axiosError = err as AxiosError;
      const specificError = (axiosError.response?.data as any)?.message || 'Failed to load reviews.';
      setError(specificError);
      toast.error(specificError);
      setReviews([]);
      setFilteredReviews([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (!lowerQuery) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter((review) =>
        review.reviewText.toLowerCase().includes(lowerQuery) ||
        (review.customer?.name && review.customer.name.toLowerCase().includes(lowerQuery)) ||
        (review.customer?.email && review.customer.email.toLowerCase().includes(lowerQuery)) ||
        (review.restaurant?.name && review.restaurant.name.toLowerCase().includes(lowerQuery)) ||
        (review.order?.pk && String(review.order.pk).includes(lowerQuery))
      );
      setFilteredReviews(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, reviews]);

  const handleDelete = async (reviewId: number) => {
    if (!reviewId) {
      toast.error('Invalid review ID.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/api/order/delete-review/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Optimistically update UI or refetch
        setReviews(prev => prev.filter((review) => review.pk !== reviewId));
        // setFilteredReviews(prev => prev.filter((review) => review.pk !== reviewId)); // Handled by useEffect on reviews change
        toast.success('Review deleted successfully.');
      } catch (err) {
        console.error('Error deleting review:', err);
        toast.error('Failed to delete review.');
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingReview || !editingReview.pk) {
      toast.error('Invalid review ID or data for update.');
      return;
    }
    if (editingReview.reviewText.trim() === '') {
        toast.error('Review text cannot be empty.');
        return;
    }
    try {
      const payload = {
        reviewText: editingReview.reviewText,
        rating: editingReview.rating,
        pk: editingReview.pk, // Ensure PK is part of payload if API expects it
      };
      await axios.put(
        `http://localhost:8080/api/order/update-review/${editingReview.pk}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update UI or refetch
      setReviews(prevReviews =>
        prevReviews.map((review) =>
          review.pk === editingReview.pk ? { ...review, ...editingReview } : review // Keep original nested objects, only update reviewText & rating
        )
      );
      // setFilteredReviews will update via useEffect on 'reviews' change
      closeModal();
      toast.success('Review updated successfully.');
    } catch (err) {
      console.error('Error updating review:', err);
      toast.error('Failed to update review.');
    }
  };

  const openEditModal = (review: Review) => {
    if (!review || !review.pk) {
      toast.error('Cannot edit: Invalid review data.');
      return;
    }
    setEditingReview({ ...review }); // Create a shallow copy for editing
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingReview(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (editingReview) {
      const { name, value } = e.target;
      setEditingReview({
        ...editingReview,
        [name]: name === 'rating' ? parseInt(value) : value,
      });
    }
  };

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100"> {/* Changed background for better contrast */}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" newestOnTop />
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Reviews</h1>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search reviews (text, customer, restaurant, order ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {loading ? (
          <SkeletonLoader /> // Use your existing skeleton loader
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-12V2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search." : "There are no reviews to display yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review (ID & Text)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order (ID & Status)</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReviews.map((review) => (
                    <tr key={review.pk} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                        <span className="font-semibold block">ID: {review.pk}</span>
                        <p className="truncate" title={review.reviewText}>{review.reviewText || "N/A"}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StarRating rating={review.rating} size="sm" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{review.customer?.name || "N/A"}</div>
                        <div className="text-xs text-gray-500">{review.customer?.email || "N/A"}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{review.restaurant?.name || "N/A"}</div>
                        <div className="text-xs text-gray-500">{review.restaurant?.foodType || "N/A"}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">Order #{review.order?.pk || "N/A"}</div>
                        <div className="text-xs">
                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                               review.order?.status === OrderStatusEnum.DELIVERED ? 'bg-green-100 text-green-800' :
                               review.order?.status === OrderStatusEnum.CANCELLED || review.order?.status === OrderStatusEnum.REJECTED ? 'bg-red-100 text-red-800' :
                               'bg-yellow-100 text-yellow-800'
                           }`}>
                               {review.order?.status?.replace(/_/g, ' ') || "N/A"}
                           </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => openEditModal(review)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-100 transition-colors"
                            title="Edit Review"
                          >
                            {/* Heroicon: PencilSquare */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(review.pk)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors"
                            title="Delete Review"
                          >
                            {/* Heroicon: Trash */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredReviews.length > itemsPerPage && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700">
                <p className="mb-2 sm:mb-0">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredReviews.length)}</span> of{' '}
                  <span className="font-medium">{filteredReviews.length}</span> reviews
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(filteredReviews.length / itemsPerPage))
                      )
                    }
                    disabled={currentPage === Math.ceil(filteredReviews.length / itemsPerPage) || filteredReviews.length === 0}
                    className="px-3 py-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        {isModalOpen && editingReview && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Edit Review (ID: {editingReview.pk})
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Review Text</label>
                      <textarea
                        id="reviewText"
                        name="reviewText"
                        value={editingReview.reviewText || ''}
                        onChange={handleEditChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                      <select
                        id="rating"
                        name="rating"
                        value={editingReview.rating || 1}
                        onChange={handleEditChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!editingReview.reviewText.trim()}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}