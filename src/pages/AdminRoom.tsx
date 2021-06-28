import LogoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import '../styles/room.scss'
import {RoomCode} from '../components/RoomCode'
import {useHistory, useParams} from 'react-router-dom'
import {Question} from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
import { database } from '../services/firebase'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
//import { useAuth } from '../hooks/useAuth'

type RoomParams ={
    id: string
}



export function AdminRoom(){
    //const {user} = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const {title,questions} = useRoom(roomId)
    const history = useHistory()

  

  async  function handleDeleteQuestion(questionId:string){
      if(  window.confirm('Você tem certeza que deseja excluir esta pergunta?')){
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      }
    }

    async function handleEndRoom(){
       await database.ref(`rooms/${roomId}`).update({
           endedAt: new Date()
       })

       history.push('/')
    }
     
  async  function handleCheckQuestionAsAnswered(questionId:string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

   async function handleHighLightQuestion(questionId:string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true
    })
    }

    return(
        <div id="page-room">
            <header>
               <div className="content">
                    <img src={LogoImg} alt="LetMeAsk"/>
                 <div>
                 <RoomCode  code={roomId}/>
                 <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                 </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

              
            <div className="question-list">
            {questions.map(question =>{
                   return (
                       <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered= {question.isAnswered}
                        isHighlighted = {question.isHighLighted}
                       >
                          {!question.isAnswered && (
                              <>
                               <button
                               type="button"
                               onClick={() => handleCheckQuestionAsAnswered(question.id)}
                             >
                                 <img alt="Marcar Pergunta como respondida" src={checkImg} />
                             </button>
                             <button
                               type="button"
                               onClick={() => handleHighLightQuestion(question.id)}
                             >
                                 <img alt="Dar destaque a Pergunta" src={answerImg} />
                             </button>
                             </>
                          )}
                           <button
                             type="button"
                             onClick={() => handleDeleteQuestion(question.id)}
                           >
                               <img alt="Remover Pergunta" src={deleteImg} />
                           </button>
                       </Question>
                   )
               })}
            </div>
            </main>
        </div>
    )
}