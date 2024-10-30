'use client'; // Add this directive at the top

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

function DropDown({ items }: any) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Choose Category</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" className="bg-gray-100 rounded-lg">
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            className={`hover:bg-gray-200`}
            color={item.color || 'default'}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDown;
