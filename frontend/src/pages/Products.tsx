import { useEffect, useMemo, useState } from 'react';
import {
  getProducts,
  type Product,
} from '../services/product.service';
import ProductDetail from './ProductDetail';

const PRODUCTS_PER_PAGE = 10;

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState<string | undefined>(
    undefined
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );

  const totalPages = useMemo(() => {
    return Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  }, [totalProducts]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getProducts(
          activeSearch,
          currentPage,
          PRODUCTS_PER_PAGE
        );

        if (cancelled) {
          return;
        }

        setProducts(result.products);
        setCurrentPage(result.page);
        setTotalProducts(result.total);
        setHasNextPage(result.hasNextPage);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(err);
        setError('No fue posible cargar los productos.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [activeSearch, currentPage]);

  const handleSearch = () => {
    const value = search.trim() || undefined;

    setSelectedProducts([]);
    setActiveSearch(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage((page) => page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      setCurrentPage((page) => page + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage &&
      !loading
    ) {
      setCurrentPage(page);
    }
  };

  const isSelected = (productId: string) => {
    return selectedProducts.some(
      (product) => product.productId === productId
    );
  };

  const toggleProduct = (product: Product) => {
    setSelectedProducts((current) => {
      const exists = current.some(
        (item) => item.productId === product.productId
      );

      if (exists) {
        return current.filter(
          (item) => item.productId !== product.productId
        );
      }

      return [...current, product];
    });
  };

  const allCurrentPageSelected = useMemo(() => {
    return (
      products.length > 0 &&
      products.every((product) =>
        selectedProducts.some(
          (selected) =>
            selected.productId === product.productId
        )
      )
    );
  }, [products, selectedProducts]);

  const toggleAllCurrentPage = () => {
    if (allCurrentPageSelected) {
      setSelectedProducts((current) =>
        current.filter(
          (selected) =>
            !products.some(
              (product) =>
                product.productId === selected.productId
            )
        )
      );

      return;
    }

    setSelectedProducts((current) => {
      const existingIds = new Set(
        current.map((product) => product.productId)
      );

      const newProducts = products.filter(
        (product) => !existingIds.has(product.productId)
      );

      return [...current, ...newProducts];
    });
  };

  const exportToCsv = () => {
    const dataToExport =
      selectedProducts.length > 0
        ? selectedProducts
        : products;

    if (dataToExport.length === 0) {
      return;
    }

    const headers = [
      'Product ID',
      'Producto',
      'Marca',
      'SKUs',
      'Categorías',
      'Link',
    ];

    const rows = dataToExport.map((product) => [
      product.productId,
      product.productTitle,
      product.brand,
      product.items
        .map((item) => item.itemId)
        .join(' | '),
      product.categories.join(' | '),
      product.linkText || '',
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'offcorss-productos.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = start;
      page <= end;
      page++
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <section
      className="products-page"
      aria-labelledby="products-title"
    >
      <div className="products-header">
        <div>
          <div className="page-eyebrow">
            CATÁLOGO
          </div>

          <h1 id="products-title">Productos</h1>

          <p>
            Consulta y administra el catálogo
            de productos de OFFCORSS.
          </p>
        </div>

        <div className="products-counter">
          <strong>
            {totalProducts.toLocaleString('es-CO')}
          </strong>{' '}
          {totalProducts === 1
            ? 'producto'
            : 'productos'}
        </div>
      </div>

      <form
        className="search-container"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <label
          className="sr-only"
          htmlFor="product-search"
        >
          Buscar producto
        </label>

        <input
          id="product-search"
          name="search"
          type="search"
          className="search-input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button
          type="submit"
          className="search-button"
        >
          Buscar
        </button>
      </form>

      <div className="products-actions">
        <button
          type="button"
          className="export-button"
          onClick={exportToCsv}
          disabled={
            products.length === 0 &&
            selectedProducts.length === 0
          }
        >
          Exportar CSV
        </button>

        {selectedProducts.length > 0 && (
          <span className="selected-count">
            {selectedProducts.length} seleccionados
          </span>
        )}
      </div>

      {loading && (
        <div
          className="loading-state"
          role="status"
          aria-live="polite"
        >
          Cargando productos...
        </div>
      )}

      {error && (
        <div
          className="error-state"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div
            className="empty-state"
            role="status"
          >
            No se encontraron productos.
          </div>
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <>
            <div className="table-container">
              <table className="products-table" key={`${currentPage}-${activeSearch ?? ''}`}>
                <caption className="sr-only">
                  Catálogo de productos de OFFCORSS
                </caption>

                <thead>
                  <tr>
                    <th scope="col">
                      <input
                        type="checkbox"
                        checked={allCurrentPageSelected}
                        onChange={toggleAllCurrentPage}
                        aria-label="Seleccionar todos los productos"
                      />
                    </th>

                    <th scope="col">
                      Producto
                    </th>

                    <th scope="col">
                      Marca
                    </th>

                    <th scope="col">
                      Product ID
                    </th>

                    <th scope="col">
                      Items / SKUs
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const selected = isSelected(
                      product.productId
                    );

                    const image = product.images[0];

                    return (
                      <tr
                        key={product.productId}
                        className={
                          selected
                            ? 'row-selected'
                            : ''
                        }
                        onClick={() =>
                          setSelectedProduct(product)
                        }
                      >
                        <td
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleProduct(product)
                            }
                            aria-label={`Seleccionar ${product.productTitle}`}
                          />
                        </td>

                        <td>
                          <div className="product-cell">
                            {image ? (
                              <img
                                className="product-image"
                                src={image.imageUrl}
                                alt={
                                  image.imageText ||
                                  product.productTitle
                                }
                                loading="lazy"
                                decoding="async"
                                width="64"
                                height="64"
                              />
                            ) : (
                              <div
                                className="product-image product-image-empty"
                                aria-hidden="true"
                              >
                                —
                              </div>
                            )}

                            <div>
                              <div className="product-name">
                                {product.productTitle}
                              </div>

                              <div className="product-brand">
                                {product.brand}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {product.brand}
                        </td>

                        <td>
                          <span className="product-id">
                            {product.productId}
                          </span>
                        </td>

                        <td>
                          <span className="items-cell">
                            {product.items.length}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav
                className="pagination"
                aria-label="Paginación de productos"
              >
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={
                    currentPage === 1 ||
                    loading
                  }
                  aria-label="Página anterior"
                >
                  ← Anterior
                </button>

                <div className="pagination-pages">
                  {getPageNumbers().map(
                    (page, index) => {
                      if (page === '...') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="pagination-ellipsis"
                            aria-hidden="true"
                          >
                            …
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          type="button"
                          className={
                            page === currentPage
                              ? 'pagination-page-active'
                              : ''
                          }
                          aria-current={
                            page === currentPage
                              ? 'page'
                              : undefined
                          }
                          onClick={() =>
                            handlePageChange(
                              page as number
                            )
                          }
                          disabled={loading}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    !hasNextPage ||
                    loading
                  }
                  aria-label="Página siguiente"
                >
                  Siguiente →
                </button>
              </nav>
            )}

            {totalPages > 0 && (
              <div className="pagination-info">
                Página{' '}
                <strong>{currentPage}</strong>{' '}
                de{' '}
                <strong>{totalPages}</strong>
              </div>
            )}
          </>
        )}
    </section>
  );
}

export default Products;