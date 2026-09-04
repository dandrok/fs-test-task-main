import { FilterItem } from 'components/filterItem';
import { DropdownOption } from '../dropdown';
import { Search } from '../search';

const sortOptions: DropdownOption[] = [
  { name: 'price', title: 'Cena' },
  { name: 'capacity', title: 'Pojemność' },
];

const featuresOptions: DropdownOption[] = [
  { name: 'Panel AI Control' },
  { name: 'Silnik inwerterowy' },
  { name: 'Wyświetlacz elektroniczny' },
];

const energyClassOptions: DropdownOption[] = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];

const capacityOptions: DropdownOption[] = [{ name: 8 }, { name: 9 }, { name: 10.5 }];

export const Filters = () => {
  return (
    <div>
      <div className="mb-8 pt-6 flex max-w-xs mx-auto">
        <Search />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <FilterItem title="Sortuj" options={sortOptions} filter="sort" />
        <FilterItem title="Funkcje" options={featuresOptions} filter="feature" />
        <FilterItem title="Klasa energetyczna" options={energyClassOptions} filter="energyClass" />
        <FilterItem title="Pojemność" options={capacityOptions} filter="capacity" />
      </div>
    </div>
  );
};
