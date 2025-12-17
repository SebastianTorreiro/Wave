import style from './form.module.scss'
import { useState, useEffect } from 'react'
import { Icons } from 'components/Icons'
import { useFormFields } from 'hooks/useFormFields'
import { useValidator } from 'hooks/useValidation'
import { useSession } from 'hooks/useSession'
import { useRouter } from 'next/navigation'

const { HiddenPassword, ViewPassword } = Icons

type Errors<T> = {
  [_key in keyof T]: string | undefined;
};

export function Login () {
  const router = useRouter() // <--- AGREGAR ESTO
  const [showPassword, setShowPassword] = useState(false)
  const { fields, handleChange } = useFormFields<{ password: string, email: string }>()
  const [errors, setErrors] = useState<Errors<typeof fields>>()
  const [isLoading, setIsLoading] = useState(false)
  const validateForm = useValidator()
  const { setSession } = useSession()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const foundErrors = validateForm(fields)
    if (foundErrors) setErrors(foundErrors as Errors<typeof fields>)
    else {
      setErrors(undefined)
      setIsLoading(true)
    }
  }

  useEffect(() => {
    if (isLoading) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(fields),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) {
            setErrors({ password: undefined, email: 'Credenciales inválidas.' })
            throw new Error('Credenciales inválidas.')
          } else {
            return res.json()
          }
        })
        .then(data => {
          console.log(data)
          setSession(data)
          if (data.user?.categorys?.length > 0) {
            router.push('/home') // O '/messages/matches' según tu flujo
          } else {
            router.push('/setup-account')
          }
        })
        .catch((e) => {
          setErrors({ password: undefined, email: 'Credenciales inválidas.' })
          console.error(e)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isLoading])

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <span className={style.field}>
        <label htmlFor="email">Usuario</label>
        <input type="text" name="email" placeholder='Correo electrónico' className={errors?.email ? style.error : ''} onChange={handleChange} />
      </span>
      <span className={style.field}>
        <label htmlFor="password">Contraseña</label>
        <input type={showPassword ? 'text' : 'password'} name="password" className={errors?.password ? style.error : ''} placeholder='Contraseña' onChange={handleChange} />
        {showPassword ? <ViewPassword width={15} height={15} className={style.icon} onClick={togglePasswordVisibility}/> : <HiddenPassword width={15} height={15} className={style.icon} onClick={togglePasswordVisibility}/>}
        <small>Debe contener al menos 8 caracteres, una mayúscula, un número y un caracter especial.</small>
      </span>
      <p>Inicia sesión con Google</p>
      <button disabled={isLoading} className={style.submit} type='submit'>{isLoading ? 'Cargando...' : 'Ingresar'}</button>
    </form>
  )
}
