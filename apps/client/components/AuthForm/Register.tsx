import style from './form.module.scss'
import { useState } from 'react'
import { Icons } from 'components/Icons'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'

const { Eye } = Icons

// 1. Tipado estricto: Define exactamente qué datos maneja este formulario
type RegisterInputs = {
  email: string;
  password: string;
};

export function Register ({
  showValidationForm
}: {
  showValidationForm: (_email: string) => void;
}) {
  // 2. useForm: El hook que gestiona todo (errores, valores, estado de envío)
  // 'register' conecta los inputs con el hook.
  // 'handleSubmit' gestiona el envío y previene el refresh automático.
  // 'formState' nos da acceso a los errores y al estado 'isSubmitting'.
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInputs>()

  const [showPassword, setShowPassword] = useState(false)

  // 3. Función de envío limpia: Solo se ejecuta si la validación pasa.
  // Ya no necesitas 'useEffect' ni estados de 'isLoading' manuales.
  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      // Usamos axios (que ya lo tienes instalado) en lugar de fetch para código más limpio
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email: data.email,
        password: data.password
      })

      // Si todo sale bien, avanzamos al siguiente paso
      showValidationForm(data.email)
    } catch (error: unknown) {
      console.error(error)
      // 4. Manejo de errores del servidor:
      // Si el back dice "El usuario ya existe", lo mostramos en el campo email.
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError('email', {
          type: 'manual',
          message: 'Este correo ya está registrado o es inválido.'
        })
      } else {
        setError('root', {
          type: 'server',
          message: 'Ocurrió un error inesperado. Intenta nuevamente.'
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form} noValidate>
      {/* CAMPO EMAIL */}
      <span className={style.field}>
        <label htmlFor="email">Usuario</label>
        <input
          id="email"
          type="email"
          placeholder="Correo electrónico"
          className={errors.email ? style.error : ''}
          // Aquí conectamos el input con React Hook Form y definimos las reglas
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Ingresa un correo válido'
            }
          })}
        />
        {/* Mostramos el mensaje de error si existe */}
        {errors.email && (
          <small className={style.errorMessage}>{errors.email.message}</small>
        )}
      </span>

      {/* CAMPO PASSWORD */}
      <span className={style.field}>
        <label htmlFor="password">Contraseña</label>
        <div className={style.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Crear contraseña"
            className={errors.password ? style.error : ''}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'Debe tener al menos 8 caracteres'
              },
              // Replicamos la Regex de tu Backend (DTO)
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  'Debe tener mayúscula, minúscula, número y carácter especial'
              }
            })}
          />
          <span
            className={style.icon}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: 10,
              top: 10
            }} // Ajuste rápido de estilo
          >
            <Eye width={15} height={15} />
          </span>
        </div>

        {errors.password && (
          <small className={style.errorMessage}>
            {errors.password.message}
          </small>
        )}
        {!errors.password && <small>Debe contener al menos 8 caracteres</small>}
      </span>

      {/* ERROR GENERAL DEL FORMULARIO */}
      {errors.root && (
        <div className={style.errorMessage} style={{ textAlign: 'center' }}>
          {errors.root.message}
        </div>
      )}

      <p>Inicia sesión con Google</p>

      {/* El botón se deshabilita automáticamente mientras se envía */}
      <button disabled={isSubmitting} className={style.submit} type="submit">
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
