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

  /*
   * Total de páginas según el total real
   * que devuelve VTEX.
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  }, [totalProducts]);

  /*
   * Cargar productos desde el backend.
   */
  const loadProducts = async (
    searchValue?: string,
    page = 1
  ) => {
    try {
      setLoading(true);
      setError('');

      const result = await getProducts(
        searchValue,
        page,
        PRODUCTS_PER_PAGE
      );

      setProducts(result.products);
      setCurrentPage(result.page);
      setTotalProducts(result.total);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      console.error(err);

      setError(
        'No fue posible cargar los productos.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Carga inicial y cambio de página/búsqueda.
   */
  useEffect(() => {
    loadProducts(
      activeSearch,
      currentPage
    );
  }, [activeSearch, currentPage]);

  /*
   * Ejecutar búsqueda.
   */
  const handleSearch = () => {
    const value = search.trim() || undefined;

    setSelectedProducts([]);

    /*
     * Si ya estamos en página 1, el useEffect
     * no se ejecutaría porque currentPage no cambia.
     * Por eso actualizamos activeSearch directamente.
     */
    setActiveSearch(value);

    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  /*
   * Página anterior.
   */
  const handlePreviousPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage((page) => page - 1);
    }
  };

  /*
   * Página siguiente.
   */
  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      setCurrentPage((page) => page + 1);
    }
  };

  /*
   * Ir directamente a una página.
   */
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

  /*
   * Verificar si un producto está seleccionado.
   */
  const isSelected = (productId: string) => {
    return selectedProducts.some(
      (product) => product.productId === productId
    );
  };

  /*
   * Seleccionar/deseleccionar producto.
   */
  const toggleProduct = (product: Product) => {
    setSelectedProducts((current) => {
      const exists = current.some(
        (item) =>
          item.productId === product.productId
      );

      if (exists) {
        return current.filter(
          (item) =>
            item.productId !== product.productId
        );
      }

      return [...current, product];
    });
  };

  /*
   * Saber si todos los productos de la página
   * actual están seleccionados.
   */
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

  /*
   * Seleccionar/deseleccionar todos los productos
   * de la página actual.
   */
  const toggleAllCurrentPage = () => {
    if (allCurrentPageSelected) {
      setSelectedProducts((current) =>
        current.filter(
          (selected) =>
            !products.some(
              (product) =>
                product.productId ===
                selected.productId
            )
        )
      );

      return;
    }

    setSelectedProducts((current) => {
      const existingIds = new Set(
        current.map(
          (product) => product.productId
        )
      );

      const newProducts = products.filter(
        (product) =>
          !existingIds.has(product.productId)
      );

      return [
        ...current,
        ...newProducts,
      ];
    });
  };

  /*
   * Exportar productos seleccionados.
   *
   * Si hay productos seleccionados:
   * exporta esos productos.
   *
   * Si no hay selección:
   * exporta los productos de la página actual.
   */
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

    const rows = dataToExport.map(
      (product) => [
        product.productId,
        product.productTitle,
        product.brand,
        product.items
          .map((item) => item.itemId)
          .join(' | '),
        product.categories.join(' | '),
        product.linkText || '',
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download =
      'offcorss-productos.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * Generar números de página.
   *
   * Ejemplo:
   * 1 2 3 4 5 ... 25
   */
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

    const start = Math.max(
      2,
      currentPage - 1
    );

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

  /*
   * Mostrar detalle del producto.
   */
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() =>
          setSelectedProduct(null)
        }
      />
    );
  }

  return (
    <section className="products-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="products-header">

        <div>
          <div className="page-eyebrow">
            CATÁLOGO
          </div>

          <h1>
            Productos
          </h1>

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

      {/* =====================================================
          BUSCADOR
      ===================================================== */}

      <div className="search-container">

        <input
          type="text"
          className="search-input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
        />

        <button
          type="button"
          className="search-button"
          onClick={handleSearch}
        >
          Buscar
        </button>

      </div>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

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
            {selectedProducts.length}{' '}
            seleccionados
          </span>
        )}

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="loading-state">
          Cargando productos...
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="empty-state">
            No se encontraron productos.
          </div>
        )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <>

            <div className="table-container">

              <table className="products-table">

                <thead>

                  <tr>

                    <th>
                      <input
                        type="checkbox"
                        checked={
                          allCurrentPageSelected
                        }
                        onChange={
                          toggleAllCurrentPage
                        }
                        aria-label="Seleccionar todos"
                      />
                    </th>

                    <th>
                      Producto
                    </th>

                    <th>
                      Marca
                    </th>

                    <th>
                      Product ID
                    </th>

                    <th>
                      Items / SKUs
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => {

                      const selected =
                        isSelected(
                          product.productId
                        );

                      const image =
                        product.images[0];

                      return (
                        <tr
                          key={
                            product.productId
                          }
                          className={
                            selected
                              ? 'row-selected'
                              : ''
                          }
                          onClick={() =>
                            setSelectedProduct(
                              product
                            )
                          }
                        >

                          {/* CHECKBOX */}

                          <td
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >

                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                toggleProduct(
                                  product
                                )
                              }
                              aria-label={`Seleccionar ${product.productTitle}`}
                            />

                          </td>

                          {/* PRODUCTO */}

                          <td>

                            <div className="product-cell">

                              {image ? (
                                <img
                                  className="product-image"
                                  src={
                                    image.imageUrl
                                  }
                                  alt={
                                    image.imageText ||
                                    product.productTitle
                                  }
                                />
                              ) : (
                                <div className="product-image product-image-empty">
                                  —
                                </div>
                              )}

                              <div>

                                <div className="product-name">
                                  {
                                    product.productTitle
                                  }
                                </div>

                                <div className="product-brand">
                                  {
                                    product.brand
                                  }
                                </div>

                              </div>

                            </div>

                          </td>

                          {/* MARCA */}

                          <td>
                            {
                              product.brand
                            }
                          </td>

                          {/* PRODUCT ID */}

                          <td>

                            <span className="product-id">
                              {
                                product.productId
                              }
                            </span>

                          </td>

                          {/* SKUS */}

                          <td>

                            <span className="items-cell">
                              {
                                product.items
                                  .length
                              }
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <div className="pagination">

                <button
                  type="button"
                  onClick={
                    handlePreviousPage
                  }
                  disabled={
                    currentPage === 1 ||
                    loading
                  }
                >
                  ← Anterior
                </button>

                <div className="pagination-pages">

                  {getPageNumbers().map(
                    (page, index) => {

                      if (
                        page === '...'
                      ) {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="pagination-ellipsis"
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
                            page ===
                            currentPage
                              ? 'pagination-page-active'
                              : ''
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
                  onClick={
                    handleNextPage
                  }
                  disabled={
                    !hasNextPage ||
                    loading
                  }
                >
                  Siguiente →
                </button>

              </div>
            )}

            {/* =================================================
                PAGINATION INFO
            ================================================= */}

            {totalPages > 0 && (
              <div className="pagination-info">
                Página{' '}
                <strong>
                  {currentPage}
                </strong>{' '}
                de{' '}
                <strong>
                  {totalPages}
                </strong>
              </div>
            )}

          </>
        )}

    </section>
  );
}

export default Products;