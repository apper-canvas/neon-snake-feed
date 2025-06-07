import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const ControlHint = ({ iconName, text, keyboardKey, className }) => {
    return (
        <div className={`flex items-center gap-2 ${className || ''}`}>
            {iconName && (
                <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                    <ApperIcon name={iconName} size={16} />
                </div>
            )}
            {keyboardKey && (
                <div className="px-4 py-2 border border-gray-400 rounded text-xs flex items-center justify-center">
                    {keyboardKey}
                </div>
            )}
            <span>{text}</span>
        </div>
    );
};

export default ControlHint;