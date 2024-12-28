import React, { useState } from "react";

interface TabsProps {
    tags: string[];
    onSelectTag: (tag: string | null) => void;
}

const Tabs: React.FC<TabsProps> = ({ tags, onSelectTag }) => {
    const [customTabs, setCustomTabs] = useState<string[]>([]);
    const [newTab, setNewTab] = useState("");
    const [isCreatingTab, setIsCreatingTab] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleAddTab = () => {
        if (newTab.trim() && !customTabs.includes(newTab)) {
            setCustomTabs([...customTabs, newTab]);
            setNewTab("");
            setIsCreatingTab(false);
        }
    };

    const handleTabClick = (tag: string | null) => {
        setSelectedTag(tag);
        onSelectTag(tag); // Pass the selected tag to the parent
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto p-4 rounded-md">
            {/* Default All Tab */}
            <button
                onClick={() => handleTabClick(null)}
                className={`px-4 py-2 rounded-md ${
                    selectedTag === null
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                }`}
            >
                All
            </button>

            {/* Loaded Tabs */}
            {tags.map((tag, index) => (
                <button
                    key={index}
                    onClick={() => handleTabClick(tag)}
                    className={`px-4 py-2 rounded-md ${
                        selectedTag === tag
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    #{tag}
                </button>
            ))}

            {/* Custom Tabs */}
            {customTabs.map((customTag, index) => (
                <button
                    key={index}
                    onClick={() => handleTabClick(customTag)}
                    className={`px-4 py-2 rounded-md ${
                        selectedTag === customTag
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    #{customTag}
                </button>
            ))}

            {/* Add New Tab Button */}
            {!isCreatingTab ? (
                <button
                    onClick={() => setIsCreatingTab(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    +
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newTab}
                        onChange={(e) => setNewTab(e.target.value)}
                        placeholder="Enter tag"
                        className="px-2 py-1 border rounded-md"
                    />
                    <button
                        onClick={handleAddTab}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => setIsCreatingTab(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tabs;
