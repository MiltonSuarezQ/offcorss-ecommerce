import { useState, type MouseEvent } from 'react';
import type { Product } from '../services/product.service';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

function ProductDetail({
  product,
  onBack,
}: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const handlePrint = () => {
    window.print();
  };

  const images = product.images ?? [];
  const activeImage = images[activeImageIndex];

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  const handleImageMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) / rect.height) *
      100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleImageMouseEnter = () => {
    if (activeImage) {
      setIsZoomed(true);
    }
  };

  const handleImageMouseLeave = () => {
    setIsZoomed(false);
    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const changeImage = (index: number) => {
    setActiveImageIndex(index);
    setIsZoomed(false);
    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  return (
    <section
      className="product-detail-page"
      aria-labelledby="product-detail-title"
    >
      <div className="products-header">
        <div>
          <div className="page-eyebrow">
            CATÁLOGO
          </div>

          <h1 id="product-detail-title">
            Detalle del producto
          </h1>

          <p>
            Información detallada del producto
            seleccionado.
          </p>
        </div>
      </div>

      <div className="detail-toolbar">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Volver a productos
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-layout">
          <div className="detail-gallery">
            <div
              className={`detail-image-wrapper ${
                isZoomed
                  ? 'detail-image-zoomed'
                  : ''
              }`}
              onMouseMove={handleImageMouseMove}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
            >
              {activeImage ? (
                <>
                  <img
                    key={activeImage.imageUrl}
                    className="detail-image"
                    src={activeImage.imageUrl}
                    srcSet={`${activeImage.imageUrl} 1x, ${activeImage.imageUrl} 2x`}
                    alt={
                      activeImage.imageText ||
                      `${product.productTitle} - imagen ${
                        activeImageIndex + 1
                      }`
                    }
                    loading="eager"
                    decoding="async"
                    width="600"
                    height="600"
                    style={{
                      transform: isZoomed
                        ? 'scale(2)'
                        : 'scale(1)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />

                  {isZoomed && (
                    <div
                      className="zoom-hint"
                      aria-hidden="true"
                    >
                      Zoom
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="gallery-arrow gallery-arrow-left"
                        onClick={showPreviousImage}
                        aria-label="Ver imagen anterior"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="gallery-arrow gallery-arrow-right"
                        onClick={showNextImage}
                        aria-label="Ver imagen siguiente"
                      >
                        ›
                      </button>

                      <div
                        className="gallery-counter"
                        aria-live="polite"
                      >
                        {activeImageIndex + 1} /{' '}
                        {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className="empty-state"
                  role="status"
                >
                  Sin imagen disponible
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="detail-thumbnails"
                aria-label="Galería de imágenes del producto"
              >
                {images.map((image, index) => (
                  <button
                    key={`${image.imageUrl}-${index}`}
                    type="button"
                    className={`detail-thumbnail ${
                      index === activeImageIndex
                        ? 'detail-thumbnail-active'
                        : ''
                    }`}
                    onClick={() =>
                      changeImage(index)
                    }
                    aria-label={`Ver imagen ${
                      index + 1
                    }`}
                    aria-current={
                      index === activeImageIndex
                        ? 'true'
                        : undefined
                    }
                  >
                    <img
                      src={image.imageUrl}
                      alt={
                        image.imageText ||
                        `${product.productTitle} - miniatura ${
                          index + 1
                        }`
                      }
                      loading="lazy"
                      decoding="async"
                      width="80"
                      height="80"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-content">
            <div className="detail-brand">
              {product.brand || 'Sin marca'}
            </div>

            <h2 className="detail-title">
              {product.productTitle}
            </h2>

            <dl className="detail-fields">
              <div className="detail-field">
                <dt>Product ID</dt>
                <dd>{product.productId}</dd>
              </div>

              <div className="detail-field">
                <dt>Marca</dt>
                <dd>
                  {product.brand ||
                    'No disponible'}
                </dd>
              </div>

              <div className="detail-field">
                <dt>Link del producto</dt>
                <dd>
                  {product.linkText ||
                    'No disponible'}
                </dd>
              </div>

              <div className="detail-field">
                <dt>Categorías</dt>
                <dd>
                  {product.categories.length > 0
                    ? product.categories.join(
                        ' / '
                      )
                    : 'No disponibles'}
                </dd>
              </div>

              <div className="detail-field">
                <dt>Items / SKUs</dt>
                <dd>
                  {product.items.length > 0
                    ? product.items
                        .map(
                          (item) => item.itemId
                        )
                        .join(', ')
                    : 'No disponibles'}
                </dd>
              </div>
            </dl>

            <div className="detail-actions">
              <button
                type="button"
                className="print-button"
                onClick={handlePrint}
              >
                Imprimir detalle
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;