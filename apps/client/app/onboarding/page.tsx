/* eslint-disable */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Importa tu componente viejo (asegúrate que la ruta sea correcta)
import { SliderPins } from '../../components/SliderPins' 
import style from './page.module.scss' // Probablemente necesites crear este o usar uno genérico

export default function OnboardingPage() {
  const router = useRouter()
  
  // Datos falsos para probar visualmente (luego vendrán del back)
  const [categories] = useState([
    { id: '1', name: 'Deportes', pins: ['Fútbol', 'Tenis', 'Basket'] },
    { id: '2', name: 'Anime', pins: ['Naruto', 'One Piece', 'Dragon Ball'] },
    { id: '3', name: 'Música', pins: ['Rock', 'Pop', 'Jazz'] },
  ])

  const handleFinish = () => {
    // Aquí guardaremos en el futuro
    console.log("Guardando perfil...")
    router.push('/home')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>¡Personaliza tu Wave!</h1>
      <p>Elige tus intereses para encontrar tu match perfecto.</p>
      
      {/* Aquí renderizamos tu componente recuperado */}
      <SliderPins 
        categories={categories} 
        onSelectionChange={(selected) => console.log(selected)} 
      />

      <button 
        onClick={handleFinish}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#000', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Finalizar
      </button>
    </div>
  )
}