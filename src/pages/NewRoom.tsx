import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import '../styles/auth.scss'
import Button from '../components/Button'
import {useContext, useState} from 'react'
import { AuthContext } from '../contexts/AuthContext'
import {FormEvent} from 'react'
import { database } from '../services/firebase'


export default function NewRoom(){
    const {user} = useContext(AuthContext)
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()
    async function handleCreateRoom(e: FormEvent) {
         e.preventDefault()

         if(newRoom.trim() ===''){
             return
         }

         const roomRef = database.ref('rooms')

         const firebaseRoom = await roomRef.push({
             title: newRoom,
             authorId: user?.id,
         })

         history.push(`/rooms/${firebaseRoom.key}`)

    }
    
    return(
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Perguntas e Respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <h1>{user?.name}</h1>
                    <h2>Criar uma nova Sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                          type="text"
                          placeholder="Nome da sala"
                          onChange = {e => setNewRoom(e.target.value)}
                          value={newRoom}
                        />
                        <Button>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}