import { useEffect, useState } from 'react';
import { getProducts, type Product } from '../services/product.service';

interface DashboardHomeProps {
  userName: string;
}

function DashboardHome({ userName }: DashboardHomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error'>('connected');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await getProducts(undefined, 1, 5);

        if (!mounted) return;

        setProducts(result.products);
        setTotalProducts(result.total);
        setConnectionStatus('connected');
      } catch {
        if (!mounted) return;
        setConnectionStatus('error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="dashboard-home">
      <div className="dashboard-home-header">
        <div>
          <div className="page-eyebrow">PLATAFORMA E-COMMERCE</div>
          <h1>Bienvenido, {userName}</h1>
          <p>
            Consulta y administra la información del catálogo conectado a
            OFFCORSS.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">▦</div>
          <div>
            <span>Productos disponibles</span>
            <strong>{loading ? '—' : totalProducts.toLocaleString('es-CO')}</strong>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">✓</div>
          <div>
            <span>Integración VTEX</span>
            <strong>{loading ? '—' : connectionStatus === 'connected' ? 'Conectada' : 'Error'}</strong>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">API</div>
          <div>
            <span>API Backend</span>
            <strong>{loading ? '—' : connectionStatus === 'connected' ? 'Operativa' : 'Error'}</strong>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-eyebrow">CATÁLOGO</span>
              <h2>Productos recientes</h2>
            </div>
            <span className="dashboard-panel-count">
              {loading ? 'Cargando...' : `${products.length} productos`}
            </span>
          </div>

          {loading ? (
            <div className="dashboard-loading-list">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="dashboard-product-skeleton" key={item} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="dashboard-product-list">
              {products.map((product) => (
                <article className="dashboard-product-row" key={product.productId}>
                  {product.images[0] ? (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.images[0].imageText || product.productTitle}
                      loading="lazy"
                      decoding="async"
                      width="52"
                      height="52"
                    />
                  ) : (
                    <div className="dashboard-product-placeholder">IMG</div>
                  )}

                  <div className="dashboard-product-info">
                    <strong>{product.productTitle}</strong>
                    <span>
                      {product.brand || 'Sin marca'} · ID {product.productId}
                    </span>
                  </div>
                  {product.linkText ? (
                    <a
                      className="dashboard-product-action"
                      href={`https://www.offcorss.com/${product.linkText}/p`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver producto
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              No hay productos disponibles para mostrar.
            </div>
          )}
        </section>

        <aside className="dashboard-panel dashboard-integration-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-eyebrow">INTEGRACIÓN</span>
              <h2>VTEX</h2>
            </div>
          </div>

          <div className="integration-status">
            <span
              className={`integration-status-dot ${
                connectionStatus === 'connected'
                  ? 'integration-status-connected'
                  : 'integration-status-error'
              }`}
            />
            <div>
              <strong>
                {connectionStatus === 'connected'
                  ? 'Conexión activa'
                  : 'No disponible'}
              </strong>
              <span>
                {connectionStatus === 'connected'
                  ? 'Catálogo consultado correctamente desde el backend.'
                  : 'No fue posible consultar el catálogo.'}
              </span>
            </div>
          </div>

          <div className="integration-details">
            <div>
              <span>Servicio</span>
              <strong>VTEX Catalog API</strong>
            </div>
            <div>
              <span>Origen de datos</span>
              <strong>Backend OFFCORSS</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>
                {connectionStatus === 'connected' ? 'Operativo' : 'Error'}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default DashboardHome;
