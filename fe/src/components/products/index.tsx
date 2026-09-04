import { Button } from 'components/button';
import { ProductCard } from 'components/cards/Product';
import { useFilterContext } from 'contexts/filters';
import { useProducts } from 'hooks/useProducts';
import { ChevronDown } from 'react-feather';

export const Products = () => {
  const { filters, query } = useFilterContext();
  const { products, loading, error } = useProducts(filters, query);

  if (error) {
    return (
      <div
        className="py-16 text-center bg-white rounded-2xl p-8 border border-red-100
  shadow-sm"
      >
        <p className="text-red-500 font-bold text-lg mb-1">{error}</p>
        <p className="text-gray-500 text-sm">Make sure that backend is running</p>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-xl font-medium">
          Brak produktów spełniających kryteria wyszukiwania
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
        {products.map((product) => (
          <ProductCard key={product.code} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          variant={'tertiary'}
          value={'Pokaż więcej'}
          icon={<ChevronDown />}
          onClick={() => console.log('some action')}
        />
      </div>
    </>
  );
};
