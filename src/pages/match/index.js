import { useParams , useHistory } from 'react-router-dom'
import { useEffect , useState , useRef } from 'react';
import Loading from '../../components/Loading';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux'
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Block from './block'
import {VscDebugRestart} from 'react-icons/vsc'
import {FiPower} from 'react-icons/fi'
import socket from '../../socket'
import Modal from '../../components/Modal'
import Message from './message';

function GamePart({children}) {
  return <div className={classNames(styles['game-part'] , 'col-4')}>{children}</div>
}


function MatchPage() {
    let  matchId = useParams().id
    const user = useSelector(state => state.user)
    const history = useHistory()

    const [game , setGame] = useState({
      gameInfo: Array(9).fill(null) , 
      currentUser: null ,
      currentMove: 0
    })
    const [players , setPlayers] = useState(null)
    const [isLoading , setIsLoading] = useState(true)
    const [copied , setCopied] = useState('')
    const [winner , setWinner] = useState(false)
    const [message , setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [tie , setTie] = useState(false)

  

    const endMessageRef = useRef(null)

    const scrollToBottom = () => {
      endMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }


    
    const handleSendMessage = (e) => {
      e.preventDefault()
      if(message !== '') {
        socket.emit('message' , {id: user.id , message: message , name: user.name})
      }
      setMessage('')
    }
    const handleChange = (e) => {
      setMessage(e.target.value)
    }

    const handleCopyCode = () => {
      navigator.clipboard.writeText(matchId);
      setCopied('Copied!')
      setTimeout(() => {
        setCopied('')
      } , 3000)
    }

    const handleResetMatch = () => {
      socket.emit('reset-match' , matchId)
      setWinner(false)
    }
    const handleEndMatch = () => {
      socket.emit('delete-match' , matchId)
    }

    
      
    

    

    let turns;
    let enemy;
    let isYourTurn = false;
    if(players !== null) {
     enemy = players.filter(player => user.id !== player.id)[0]
     if(players[0] === enemy) {
       turns = {you: 'O' , enemy: 'X'}
     } else {
       turns = {you: 'X' , enemy: 'O'}
     }
     if(user.id === players[0].id) {
      isYourTurn = true
     }
    }
    if(game.currentUser !== null) {
      if(game.currentUser.id === user.id) {
        isYourTurn = false
      } else {
        isYourTurn = true
      }
    } 
    
    
   
    
    const gameParts = [
      {
        content: <div>
          <div className={styles.players}>
            <div className={styles['player-detail-container']}>
            <span className={styles.you}>You: {user.name} {`(${turns?.you})`}
             </span>
             <span className={styles['your-id']} data-tip='Your ID'>{user.id}</span>
            </div>
          <div className={styles['player-detail-container']}> 
             <span className={styles.enemy}>Enemy: {enemy?.name} {`(${turns?.enemy})`}
             </span>
             <span className={styles['enemy-id']} data-tip='Enemy ID'>{enemy?.id}</span>
             </div>
            <ReactTooltip effect='solid' />
          </div>
        </div> ,
        key: '0'
      } ,
      {
        content: <div className={styles['game-div']}>
         
          <div className={classNames(styles.game , 'row')}>
          {isYourTurn ? <span className={styles['your-turn-text']}>Your turn</span> : <span className={styles['enemy-turn-text']}>Enemy`s turn</span> }
            {game.gameInfo.map((block , index) => 
            <Block isYourTurn={isYourTurn} key={index} value={block} index={index} user={user} />
            )}
          </div>
        </div> ,
        key: '1'
      } ,
      {
        content: <div className={styles['chat-part']}>
          <div className={styles['chat-container']}>
            <span>{enemy?.name} has joined</span>
            {messages.map((messageInfo , i) => 
            <Message 
            key={i}
            messageInfo={messageInfo} 
            isEnemy={messageInfo.id === enemy.id} 
            />)}
            <div ref={endMessageRef} />
          </div>
          <div className={styles['input-container']}>
            <form onSubmit={handleSendMessage}>
            <input
             value={message} 
             onChange={handleChange} 
             placeholder='Write a message...' 
             />
            <button type='submit'>Send</button>
            </form>
            </div>
        </div> ,
        key:'2'
      } 
    ]
    
    useEffect(() => {
        socket.emit('add-queue' , {matchId : matchId , playerName: user.name , playerId: user.id})
        socket.on('create-match' , (matchData) => {
          setPlayers([ matchData.player1 , matchData.player2])
          setIsLoading(false)
        })
        socket.on('player-moved' , (moveInfo) => {
          setGame({
            gameInfo: moveInfo.currentGame.game ,
            currentUser: moveInfo.currentUser ,
            currentMove: moveInfo.currentMove
          })
        })
        socket.on('end-game' , (winnerInfo) => {
          setWinner(winnerInfo)
        })
        socket.on('match-ended' , (id) => {
          if(id === matchId) {
            history.push('/')
          }
        })
        socket.on('match-reseted' , (id) => {
          if(matchId === id) {
            setGame({
              gameInfo: Array(9).fill(null) , 
              currentUser: null ,
              currentMove: 0
            })
            setWinner(false)
            setTie(false)
          }
        })
        socket.emit('find-match' , matchId)
        socket.on('finded-match' , (matchInfo) => {
          if(matchInfo !== null) {
            setGame({
              gameInfo: matchInfo.game , 
              currentUser: matchInfo.currentUser ,
              currentMove: matchInfo.currentMove
            })
            if(matchInfo.winner) {
              setWinner(matchInfo.winner)
            }
          }
        })
      } , [])
      useEffect(() => {
        socket.on('new-message' , messageInfo => {
          setMessages((prevMessages) =>[...prevMessages, messageInfo])
          scrollToBottom()
        })
      } , [])
      useEffect(() => {
        if(game.currentMove === 9 && !winner) {
          setTie((prev) => !prev)
        }
      } , [game.currentMove , winner])
    
    return <>
    {isLoading ? <div className={styles['loading-container']}>
      <div className={classNames(styles.loading , 'col-4')}>
        <div data-tip="Copy to your clipboard..." onClick={handleCopyCode} className={styles.code}>
        <ReactTooltip effect='solid' />
          <div>
        </div>
        <span>Invite code: {matchId} <span className={styles.alert}>{copied}</span></span> 
        </div>
      <Loading />
     <span className={styles['loading-text']}>Waiting for another player...</span> 
     </div>
      </div> 
    : <div className={classNames(styles.main , 'row p-0 justify-content-center')}>
      <div className={classNames(styles['game-container'] , 'col-10')}>
        <div className={classNames(styles.row ,'row p-0')}>
          {gameParts.map(part =>  <GamePart key={part.key}>{part.content}</GamePart>)}
        </div>
      </div>
      
      <Modal show={!winner ? false : true} >
      <div className={winner ? styles['win-info-activate'] : styles['win-info']}>
          <div>
          <div><span>{winner.name}({winner.turn}) Wins!</span></div>
          {user.id === players[0].id ? <div>
            <span onClick={handleResetMatch} data-tip='Restart match'><VscDebugRestart className={styles['retry-icon']} /></span>
            <span onClick={handleEndMatch} data-tip='End match'><FiPower className={styles['end-icon']} /></span>
            <ReactTooltip
            arrowColor='#fff'
            className={styles['win-tooltips']}
            effect='solid'
            disable={winner ? false : true}
            />
            </div> 
            :
            <div> <span>Waiting for host...</span></div>
             }
          </div>
        </div>
      </Modal>
       <Modal show={tie}>
      <div className={winner ? styles['win-info-activate'] : styles['win-info']}>
          <div>
          <div><span>Tie!</span></div>
          {user.id === players[0].id ? <div>
            <span onClick={handleResetMatch} data-tip='Restart match'><VscDebugRestart className={styles['retry-icon']} /></span>
            <span onClick={handleEndMatch} data-tip='End match'><FiPower className={styles['end-icon']} /></span>
            <ReactTooltip
            arrowColor='#fff'
            className={styles['win-tooltips']}
            effect='solid'
            disable={tie ? false : true}
            />
            </div> 
            :
            <div> <span>Waiting for host...</span></div>
             }
          </div>
        </div>
        </Modal>
      </div>
      }
      
    </>
}
export default MatchPage