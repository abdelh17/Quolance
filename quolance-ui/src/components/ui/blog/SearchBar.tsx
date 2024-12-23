import React from 'react';

function SearchBar() {
    return (
        <div className="relative w-full max-w-md mt-6 mb-6 content-center">
            <input
                type="text"
                placeholder="Search for blog posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-md">
                Search
            </button>
        </div>
    );
}

export default SearchBar;