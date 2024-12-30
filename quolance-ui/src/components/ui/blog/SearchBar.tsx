import React from 'react';

function SearchBar() {
    return (
        <div className="flex justify-center mt-6 mb-6">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search for blog posts..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <button className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar;