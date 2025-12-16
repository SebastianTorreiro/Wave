/* eslint-disable */
import style from './form.module.scss'
import { useState } from 'react'
import { Icons } from 'components/Icons'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation' // Para redirigir al usuario al entrar

const { Eye } = Icons

type LoginInputs = {
  email: string
  password: string
}

export function Login() {
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors, isSubmitting } 
  } = useForm<LoginInputs>()

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter() // Hook para movernos de página

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      // 1. Petición Real al Backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email: data.email,
        password: data.password
      })

      // 2. ¿Qué nos devolvió el servidor?
      // Según tu AuthController, devuelve { user, access_token }
      const { access_token, user } = response.data

      // 3. Guardar el Token (El "Pase VIP")
      // Esto es crucial. Si no lo guardas, el usuario tendrá que loguearse en cada clic.
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user)) // Opcional, para tener datos rápidos

      console.log('Login exitoso! Token guardado.')

      // 4. Redirigir al Home o Dashboard
      // Ajusta '/home' a la ruta principal de tu app
      router.push('/home') 

    } catch (error: any) {
      console.error(error)
      // Manejo de errores (Usuario no encontrado o contraseña mal)
      if (axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 401)) {
        setError('root', { 
          type: 'manual', 
          message: 'Credenciales inválidas. Revisa tu correo o contraseña.' 
        })
      } else {
         setError('root', { 
          type: 'server', 
          message: 'Error de conexión. Intenta más tarde.' 
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
          {...register('email', { 
            required: 'Ingresa tu correo',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo inválido'
            }
          })}
        />
        {errors.email && <small className={style.errorMessage}>{errors.email.message}</small>}
      </span>

      {/* CAMPO PASSWORD */}
      <span className={style.field}>
        <label htmlFor="password">Contraseña</label>
        <div className={style.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className={errors.password ? style.error : ''}
            {...register('password', {
              required: 'Ingresa tu contraseña'
            })}
          />
          <span 
            className={style.icon} 
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer', position: 'absolute', right: 10, top: 10 }}
          >
            <Eye width={15} height={15} />
          </span>
        </div>
        {errors.password && <small className={style.errorMessage}>{errors.password.message}</small>}
      </span>

      {/* ERROR GENERAL (Credenciales incorrectas) */}
      {errors.root && <div className={style.errorMessage} style={{textAlign: 'center', color: 'red', marginTop: '10px'}}>{errors.root.message}</div>}

      <p>Inicia sesión con Google</p>
      
      <button disabled={isSubmitting} className={style.submit} type='submit'>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}