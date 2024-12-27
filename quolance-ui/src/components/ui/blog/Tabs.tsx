import React, { useState } from "react";

interface TabsProps {
    tags: string[];
    onSelectTag: (tag: string | null) => void;
}

const Tabs: React.FC<TabsProps> = ({ tags, onSelectTag }) => {
    const [customTabs, setCustomTabs] = useState<string[]>([]);
    const [newTab, setNewTab] = useState("");
    const [isCreatingTab, setIsCreatingTab] = useState(false);

    const handleAddTab = () => {
        if (newTab.trim() && !customTabs.includes(newTab)) {
            setCustomTabs([...customTabs, newTab]);
            setNewTab("");
            setIsCreatingTab(false);
        }
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto p-4 rounded-md">
            {/* Default All Tab */}
            <button
                onClick={() => onSelectTag(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                All
            </button>

            {/* Predefined Tags */}
            {tags.map((tag, index) => (
                <button
                    key={index}
                    onClick={() => onSelectTag(tag)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                >
                    #{tag}
                </button>
            ))}

            {/* Custom Tabs */}
            {customTabs.map((customTag, index) => (
                <button
                    key={index}
                    onClick={() => onSelectTag(customTag)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
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
