import styles from './styles.module.scss'
import classNames from 'classnames'
import socket from '../../socket'
import {useEffect} from 'react'
import { useParams } from 'react-router-dom'

function Block({index , value , user , isYourTurn}) {
    const matchId = useParams().id;
    useEffect(() => {
        
    } , [])
    const handleClick = () => {
        if(isYourTurn && !value) {
            socket.emit('player-move' , {matchId: matchId , user: user , index: index})
        }
    }
    
    return <div onClick={handleClick} 
    className={isYourTurn && !value ? classNames(styles['game-block'] , 'col-4')
     :
     classNames(styles['game-block-passive'] , 'col-4')}>
            {value}
         </div>
}

export default Block