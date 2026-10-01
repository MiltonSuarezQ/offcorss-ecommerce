import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  updateUser,
  type User,
} from '../services/user.service';

interface ProfileProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onBack: () => void;
}

function Profile({
  user,
  onUserUpdated,
  onBack,
}: ProfileProps) {
  const [form, setForm] = useState({
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        setForm({
          name: currentUser.name,
          lastName: currentUser.lastName,
          email: currentUser.email,
        });

        onUserUpdated(currentUser);
      } catch (err) {
        console.error(err);
        setError('No fue posible cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [onUserUpdated]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess('');
    setError('');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedUser = await updateUser({
        ...user,
        name: form.name,
        lastName: form.lastName,
        email: form.email,
      });

      onUserUpdated(updatedUser);

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setSuccess('Los cambios fueron guardados correctamente.');
    } catch (err) {
      console.error(err);
      setError(
        'No fue posible guardar los cambios. Verifica la información e inténtalo nuevamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section
        className="profile-page"
        aria-labelledby="profile-loading-title"
      >
        <div
          className="profile-loading"
          id="profile-loading-title"
          role="status"
          aria-live="polite"
        >
          Cargando información del perfil...
        </div>
      </section>
    );
  }

  return (
    <section
      className="profile-page"
      aria-labelledby="profile-title"
    >
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Volver al dashboard
      </button>

      <div className="profile-header">
        <div>
          <div className="page-eyebrow">
            CUENTA
          </div>

          <h1 id="profile-title">
            Mi perfil
          </h1>

          <p>
            Consulta y actualiza tu información personal.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <div
            className="profile-avatar-large"
            aria-hidden="true"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>
              {user.name} {user.lastName}
            </h2>

            <span>
              {user.userType}
            </span>
          </div>
        </div>

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-section">
            <div className="profile-section-title">
              Información de cuenta
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="username">
                  Usuario
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={user.username}
                  disabled
                />
              </div>

              <div className="profile-field">
                <label htmlFor="userType">
                  Tipo de usuario
                </label>

                <input
                  id="userType"
                  name="userType"
                  type="text"
                  value={user.userType}
                  disabled
                />
              </div>

              <div className="profile-field">
                <label htmlFor="createDate">
                  Fecha de creación
                </label>

                <input
                  id="createDate"
                  name="createDate"
                  type="text"
                  value={new Date(
                    user.createDate
                  ).toLocaleDateString('es-CO')}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">
              Información personal
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="name">
                  Nombre
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="lastName">
                  Apellido
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-field profile-field-full">
                <label htmlFor="email">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="profile-message profile-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="profile-message profile-message-success"
              role="status"
              aria-live="polite"
            >
              {success}
            </div>
          )}

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;