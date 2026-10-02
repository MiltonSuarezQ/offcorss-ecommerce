import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  createDate: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

interface FormErrors {
  username?: string;
  password?: string;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      newErrors.username = 'El usuario es obligatorio.';
    } else if (cleanUsername.length < 3) {
      newErrors.username =
        'El usuario debe tener al menos 3 caracteres.';
    } else if (cleanUsername.length > 50) {
      newErrors.username =
        'El usuario no puede superar los 50 caracteres.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password =
        'La contraseña debe tener al menos 6 caracteres.';
    } else if (password.length > 100) {
      newErrors.password =
        'La contraseña no puede superar los 100 caracteres.';
    }

    return newErrors;
  };

  const handleUsernameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setUsername(value);
    setError('');

    if (errors.username) {
      setErrors((current) => ({
        ...current,
        username: undefined,
      }));
    }
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setPassword(value);
    setError('');

    if (errors.password) {
      setErrors((current) => ({
        ...current,
        password: undefined,
      }));
    }
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    const validationErrors = validateForm();

    if (
      validationErrors.username ||
      validationErrors.password
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          username: username.trim(),
          password,
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      onLogin(response.data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Usuario o contraseña incorrectos.'
        );
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section
        className="login-card"
        aria-labelledby="login-title"
      >
        <div className="login-brand">
          <h1 id="login-title">OFFCORSS</h1>
          <p>Plataforma de productos</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="username">
              Usuario
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              maxLength={50}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username
                  ? 'username-error'
                  : undefined
              }
            />

            {errors.username && (
              <p
                id="username-error"
                className="field-error"
                role="alert"
              >
                {errors.username}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                maxLength={100}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? 'password-error'
                    : undefined
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                title={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="field-error"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;