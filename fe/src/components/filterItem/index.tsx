import { Dropdown, DropdownProps } from 'components/dropdown';

interface FilterItemProps extends DropdownProps {
  title: string;
}

export const FilterItem = ({ title, options, filter }: FilterItemProps) => {
  return (
    <div>
      <div className="block font-bold text-black text-lg mb-2">{title}</div>
      <Dropdown options={options} filter={filter} />
    </div>
  );
};
