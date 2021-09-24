import { Link , useHistory } from 'react-router-dom'
import styles from './styles.module.scss'
import {nanoid} from 'nanoid'
import classNames from 'classnames';
import Button from '../../components/Button';
import {useSelector} from 'react-redux'
import { useState } from 'react'
import Input from '../../components/Input';

function MainPage() {
    const name = useSelector(state => state.user.name)
    let matchId = nanoid(10);
    const [isJoining , setIsJoining] = useState(false)
    const [formData , setFormData] = useState({
        joinId: null ,
        error: ''
    })

    const history = useHistory()
const handleJoin = () => {
    setIsJoining((prev) => !prev)
}
const handleChangeInput = (e) => {
    setFormData({error: '' , joinId: e.target.value})
}
const handleJoinToMatch = (e) => {
    e.preventDefault()
    if(!formData.joinId || formData.joinId.length < 10) {
        setFormData({...formData , error: 'Match ID is not valid'})
    } else {
        history.push(`/match/${formData.joinId}`)
    }
}

    return <>
    <div className={classNames( styles.main , 'row p-0 justify-content-center')}>
        <div className={classNames(styles.menu , 'col-4')}>
        <h1 className={styles.title}>Tic Tac Toe</h1>
    <Link className={styles.btn} to={{
        pathname: `/match/${matchId}`,
        state: {matchId: matchId}
    }}>host</Link>
    {isJoining ? 
    <form onSubmit={handleJoinToMatch}>
        <Input 
        onChange={handleChangeInput} 
        placeHolder='Enter match ID...' 
        className={styles.input} 
        />
        <Button type='submit' className={styles.btn} content='Join' />
        <span className={styles.error}>{formData.error}</span>
    </form>
    
    :
    <Button onClick={handleJoin} className={styles.btn} content='Join' />
    }
    <div className={styles['username-container']}>
        <span>Wellcome <span>{name}</span></span>
        </div>
    </div>
    </div></>
}

export default MainPage