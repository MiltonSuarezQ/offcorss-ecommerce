import type { Product } from '../services/product.service';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

function ProductDetail({
  product,
  onBack,
}: ProductDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  const image = product.images[0];

  return (
    <section>
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Volver a productos
      </button>

      <div className="detail-card">
        <div className="detail-layout">
          <div>
            {image ? (
              <img
                className="detail-image"
                src={image.imageUrl}
                alt={
                  image.imageText ||
                  product.productTitle
                }
              />
            ) : (
              <div className="empty-state">
                Sin imagen disponible
              </div>
            )}
          </div>

          <div>
            <h2 className="detail-title">
              {product.productTitle}
            </h2>

            <div className="detail-field">
              <strong>Product ID</strong>
              <span>{product.productId}</span>
            </div>

            <div className="detail-field">
              <strong>Marca</strong>
              <span>{product.brand}</span>
            </div>

            <div className="detail-field">
              <strong>Link del producto</strong>
              <span>
                {product.linkText ||
                  'No disponible'}
              </span>
            </div>

            <div className="detail-field">
              <strong>Categorías</strong>

              <span>
                {product.categories.length > 0
                  ? product.categories.join(
                      ' / '
                    )
                  : 'No disponibles'}
              </span>
            </div>

            <div className="detail-field">
              <strong>Items / SKUs</strong>

              <span>
                {product.items.length > 0
                  ? product.items
                      .map(
                        (item) =>
                          item.itemId
                      )
                      .join(', ')
                  : 'No disponibles'}
              </span>
            </div>

            <button
              className="print-button"
              onClick={handlePrint}
            >
              Imprimir detalle
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;